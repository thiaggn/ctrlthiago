import {bindReference, getPath, unbindReference, updateReference} from "$lib/editor/internal";
import {capture, clearFalseFocus, Span} from "$lib/editor/caret";
import type {Scoped} from "$lib/editor/scope";
import {model} from "$lib/model";
import {editor} from "$lib/editor/store.svelte";
import {handleBackspace} from "$lib/editor/handler/backspace";
import {handleInsert} from "$lib/editor/handler/insert";
import {handleDelete} from "$lib/editor/handler/delete";
import {ArrowEvent, EditorEvent, InsertEvent, RemoveEvent} from "$lib/editor/event";
import {handleArrow} from "$lib/editor/handler/arrow";
import {handleEnter} from "$lib/editor/handler/enter";

type Params = {
    path: number[]
}

export function source(el: HTMLElement, p: Params) {
    const text = el.firstChild

    if (text == undefined) {
        throw new Error()
    }

    bindReference(text, el, p.path)
    let currPath = p.path

    return {
        update: (newp: Params) => {
            updateReference(text, el, currPath, newp.path)
            currPath = newp.path
        },

        destroy: () => {
            unbindReference(text, currPath)
        }
    }
}

export function listeners(el: HTMLElement) {
    document.addEventListener('keydown', validator)

    return {
        destroy: () => {
            document.removeEventListener('keydown', validator)
        }
    }
}


export class Edge {
    offset: number
    scope: Scoped<model.Word>

    constructor(offset: number, scope: Scoped<model.Word>) {
        this.offset = offset
        this.scope = scope
    }
}

async function validator(kbEv: KeyboardEvent) {
    const span = capture()

    const startPath = getPath(span.start.node)
    const endPath = getPath(span.start.node)

    if (startPath != undefined && endPath != undefined) {
        await delegator(kbEv, span, startPath, endPath)
    }
}

async function delegator(kb: KeyboardEvent, span: Span, sp: number[], ep: number[]) {
    const start = new Edge(span.start.offset, editor.searchWord(sp))
    const end = new Edge(span.end.offset, editor.searchWord(ep))

    if (kb.key.length == 1) {
        kb.preventDefault()
        if (!kb.ctrlKey) {
            return handleInsert(new InsertEvent(start, end, kb.key))
        }
    }

    if (kb.key == 'Backspace') {
        kb.preventDefault()
        if (span.isCollapsed) {
            return handleBackspace(new RemoveEvent(start, end))
        }
    }

    if (kb.key == 'Delete') {
        kb.preventDefault()
        if (span.isCollapsed) {
            return handleDelete()
        }
    }

    if (kb.key == 'ArrowLeft') {
        return handleArrow(new ArrowEvent(kb, start, end, 'left'))
    }

    if (kb.key == 'ArrowRight') {
        return handleArrow(new ArrowEvent(kb, start, end, 'right'))
    }

    if (kb.key == 'Enter') {
        kb.preventDefault()
        if (span.isCollapsed){
            return handleEnter(new EditorEvent(start, end))
        }
    }
}