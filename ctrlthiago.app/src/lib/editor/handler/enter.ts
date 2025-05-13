import type {EditorEvent} from "$lib/editor/event";
import {editor} from "$lib/editor/store.svelte";
import {model} from "$lib/model";
import {createParagraph, createTitle, createWord} from "$lib/transform.svelte";
import type {Scoped} from "$lib/editor/scope";
import {tick} from "svelte";
import {focus} from "$lib/editor/caret";
import EntityType = model.EntityType;

export function handleEnter(ev: EditorEvent) {
    const parent = editor.parentOf(ev.word)

    switch (parent.entity.type) {
        case EntityType.Paragraph: return splitParagraph(ev, parent as Scoped<model.Paragraph>)
        case EntityType.Title: return splitTitle(ev, parent as Scoped<model.Title>)
    }
}

async function splitParagraph(ev: EditorEvent, parent: Scoped<model.Paragraph>) {
    const paragraph = createParagraph(parent.entity.path.slice(0, -1))
    const newWord = createWord(
        paragraph.path,
        ev.word.text.slice(ev.offset),
        ev.word.styles
    )
    paragraph.words = paragraph.words.concat(
        [newWord, ...parent.entity.words.slice(ev.scope.index + 1)]
    )

    parent.insertAfter(paragraph)
    ev.word.text = ev.word.text.slice(0, ev.offset)
    parent.entity.words = parent.entity.words.slice(0, ev.scope.index+1)
    await tick()
    focus(newWord.path, 0)
}

async function splitTitle(ev: EditorEvent, parent: Scoped<model.Title>) {
    if (!editor.onSafeMode) {
        const title = createTitle(parent.entity.path.slice(0, -1), parent.entity.size)
        const newWord = createWord(
            title.path,
            ev.word.text.slice(ev.offset),
            ev.word.styles
        )
        title.words = title.words.concat(
            [newWord, ...parent.entity.words.slice(ev.scope.index + 1)]
        )

        parent.insertAfter(title)
        ev.word.text = ev.word.text.slice(0, ev.offset)
        parent.entity.words = parent.entity.words.slice(0, ev.scope.index+1)
        await tick()
        focus(newWord.path, 0)
    }
}