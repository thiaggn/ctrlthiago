import {tick} from "svelte";
import {focus} from "$lib/editor/caret";
import {InsertEvent} from "$lib/editor/event";

export async function handleInsert(ev: InsertEvent) {
    const text = ev.word.text.slice(0, ev.offset) + ev.char +  ev.word.text.slice(ev.offset)
    ev.word.text = text
    await tick()
    focus(ev.word.path, ev.offset + 1)
}