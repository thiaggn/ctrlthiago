import {getElement, getNode} from "$lib/editor/internal";

export class Caret {
    offset: number
    node: Node

    constructor(node: Node, offset: number, text: string) {
        this.node = node
        this.offset = offset
    }
}

export class Span {
    start: Caret
    end: Caret
    isCollapsed: boolean

    constructor(begin: Caret, end: Caret, isCollapsed: boolean) {
        this.start = begin
        this.end = end
        this.isCollapsed = isCollapsed
    }

    get offset() {
        return this.start.offset
    }
}

const defPos: Caret = {
    offset: 0,
    node: document.createTextNode(''),
}

type OrderedSelection = {
    initialNode: Node
    initialOffset: number
    finalNode: Node
    finalOffset: number
}

const defSnapshot = new Span(defPos, defPos, true)

export function capture(): Span {
    const wsel = window.getSelection()
    if (wsel == undefined)
        return defSnapshot

    if (wsel.anchorNode == null || wsel.focusNode == null)
        return defSnapshot

    const sel = reorder(
        wsel.anchorNode, wsel.anchorOffset,
        wsel.focusNode, wsel.focusOffset
    )

    const start = {
        offset: sel.initialOffset,
        node: sel.initialNode,
        text: sel.initialNode.textContent ?? ''
    }

    const end = {
        offset: sel.finalOffset,
        node: sel.finalNode,
        text: sel.finalNode.textContent ?? ''
    }

    return new Span(start, end, wsel.isCollapsed)
}

function reorder(a: Node, offA: number, b: Node, offB: number): OrderedSelection {
    const comp = a.compareDocumentPosition(b)

    if (a === b) {
        return offA <= offB
            ? {initialNode: a, initialOffset: offA, finalNode: b, finalOffset: offB}
            : {initialNode: b, initialOffset: offB, finalNode: a, finalOffset: offA}
    }

    if (comp & Node.DOCUMENT_POSITION_FOLLOWING) {
        return {initialNode: a, initialOffset: offA, finalNode: b, finalOffset: offB}
    }

    return {initialNode: b, initialOffset: offB, finalNode: a, finalOffset: offA}
}

export function focus(path: number[], offset: number) {
    const node = getNode(path)
    const sel = window.getSelection()
    if (sel) {
        sel.removeAllRanges()
        const range = document.createRange()
        range.setStart(node, offset)
        range.setEnd(node, offset)
        sel.addRange(range)
    }
}

let marked: WeakRef<HTMLElement>[] = []

export function falseFocus(focusp: number[], anchorp?: number[]) {
    const el = getElement(focusp)
    el.classList.add('caret')
    marked.push(new WeakRef(el))

    if (anchorp) {
        const el = getElement(anchorp)
        el.classList.add('hiddenCaret')
        marked.push(new WeakRef(el))
    }
}

export function clearFalseFocus() {
    for (const ref of marked) {
        const el = ref.deref()
        if (el) el.classList.remove('caret', 'hiddenCaret')
    }

    marked = []
}


document.addEventListener('mousedown', clearFalseFocus)
document.addEventListener('keydown', clearFalseFocus)