import {model} from "$lib/model";
import type {dto} from "$lib/dto";
import EntityType = model.EntityType;

let counter: number = 100

function nextId(): number {
    return counter++
}

export function adopt(words: model.Word[], parentPath: number[]): model.Word[] {
    return words.map(w => createWord(parentPath, w.text, w.styles))
}

export function createWord(parentPath: number[], text: string, style: number): model.Word {
    const id = nextId()

    return {
        id: id,
        path: [...parentPath, id],
        marked: false,
        type: model.EntityType.Word,
        styles: style,
        text: text
    }
}

export function createParagraph(parentPath: number[]): model.Paragraph {
    const id = nextId()

    return {
        id: id,
        path: [...parentPath, id],
        words: [],
        type: model.EntityType.Paragraph
    }
}

export function createTitle(parentPath: number[], size: 1 | 2 | 3): model.Title {
    const id = nextId()

    return {
        id: id,
        path: [...parentPath, id],
        words: [],
        size: size,
        type: model.EntityType.Title
    }
}

function transf_word(t: dto.Word, path: number[] = []): model.Word {
    return createWord(path, t.text, t.styles)
}

function detransf_word(t: model.Word): dto.Word {
    return {
        text: t.text,
        styles: t.styles,
        type: model.EntityType.Word
    }
}

export function transform(b: dto.Block, path: number[] = []): model.Block {
    switch (b.type) {
        case model.EntityType.Title: {
            const t = createTitle(path, b.size)
            t.words = b.words.map(w => createWord(t.path, w.text, w.styles))
            return t
        }

        case model.EntityType.Paragraph: {
            const p = createParagraph(path)
            p.words = b.words.map(w => createWord(p.path, w.text, w.styles))
            return p
        }

        default:
            throw new Error(`transform: unknown entity type:`, b)
    }
}

export function detransform(b: model.Block): dto.Block {
    switch (b.type) {
        case model.EntityType.Paragraph:
            return {
                id: b.id,
                type: b.type,
                words: b.words.map(detransf_word)
            }

        case model.EntityType.Title:
            return {
                id: b.id,
                type: b.type,
                size: b.size,
                words: b.words.map(detransf_word)
            }

        default:
            throw new Error('detransform: unknown entity', b)
    }
}