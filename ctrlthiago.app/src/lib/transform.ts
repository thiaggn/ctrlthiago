import {model} from "$lib/model";
import type {dto} from "$lib/dto";

let counter: number = 100

function transf_word(t: dto.Word, path: number[] = []): model.Word {
    const nextId = counter++

    return {
        id: nextId,
        styles: t.styles ? t.styles : [],
        type: model.EntityType.Word,
        text: t.text,
        path: [...path, nextId],
        marked: false
    }
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
        case model.EntityType.Title:
            return {
                id: b.id,
                type: b.type,
                size: b.size,
                words: b.words.map(w => transf_word(w, [...path, b.id])),
                path: [b.id]
            }

        case model.EntityType.Paragraph:
            return {
                id: b.id,
                path: [b.id],
                type: b.type,
                words: b.words.map(w => transf_word(w, [...path, b.id]))
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