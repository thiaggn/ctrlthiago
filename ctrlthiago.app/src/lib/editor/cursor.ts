import {stateBinder} from "$lib/editor/binder.svelte";

export class Cursor {
    offset: number
    node: Node

    constructor(node: Node, offset: number, text: string) {
        this.node = node
        this.offset = offset
    }
}

export class RangeCursor {
    start: Cursor
    end: Cursor
    isCollapsed: boolean

    constructor(begin: Cursor, end: Cursor, isCollapsed: boolean) {
        this.start = begin
        this.end = end
        this.isCollapsed = isCollapsed
    }

    get offset() {
        return this.start.offset
    }
}

const defPos: Cursor = {
    offset: 0,
    node: document.createTextNode(''),
}

type OrderedSelection = {
    initialNode: Node
    initialOffset: number
    finalNode: Node
    finalOffset: number
}

const defSnapshot = new RangeCursor(defPos, defPos, true)

export class Tracker {
    public static now(): RangeCursor {
        const wsel = window.getSelection()
        if (wsel == undefined)
            return defSnapshot

        if (wsel.anchorNode == null || wsel.focusNode == null)
            return defSnapshot

        const sel = this.reorder(
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

        return new RangeCursor(start, end, wsel.isCollapsed)
    }

    private static reorder(a: Node, offA: number, b: Node, offB: number): OrderedSelection {
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
}
