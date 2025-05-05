import {nodeFromPath} from "$lib/editor/maps";

export type CursorPosition = {
    offset: number
    node: Node
    text: string
}

export class CursorSnapshot {
    initial: CursorPosition
    final: CursorPosition
    isCollapsed: boolean
    valid: boolean

    constructor(begin: CursorPosition, end: CursorPosition, isCollapsed: boolean, valid: boolean) {
        this.initial = begin
        this.final = end
        this.isCollapsed = isCollapsed
        this.valid = valid
    }

    get offset() {
        return this.initial.offset
    }

    get node() {
        return this.initial.node
    }

    get text() {
        return this.initial.text
    }

    public revert(off: number = 0) {
        const sel = window.getSelection()
        if (sel) {
            sel.removeAllRanges()
            const range = document.createRange()
            range.setStart(this.initial.node, this.initial.offset + off)
            range.setEnd(this.initial.node, this.initial.offset + off)
            sel.addRange(range)
        }
    }

    public replace(path: number[], offset: number): CursorSnapshot {
        const node = nodeFromPath(path)
        this.valid = true
        this.initial.node = node
        this.final.node = node
        this.initial.offset = offset
        this.final.offset = offset
        this.initial.text = node.textContent ?? ""
        this.final.text = this.initial.text
        return this
    }
}

const defPos: CursorPosition = {
    offset: 0,
    node: document.createTextNode(''),
    text: ""
}

type OrderedSelection = {
    initialNode: Node
    initialOffset: number
    finalNode: Node
    finalOffset: number
}

const defSnapshot = new CursorSnapshot(defPos, defPos, true, false)

export class Tracker {
    public static now(): Readonly<CursorSnapshot> {
        const wsel = window.getSelection()
        if (wsel == undefined)
            return defSnapshot

        if (wsel.anchorNode == null || wsel.focusNode == null)
            return defSnapshot

        const sel = this.reorder(
            wsel.anchorNode, wsel.anchorOffset,
            wsel.focusNode, wsel.focusOffset
        )

        const initial = {
            offset: sel.initialOffset,
            node: sel.initialNode,
            text: sel.initialNode.textContent ?? ''
        }

        const final = {
            offset: sel.finalOffset,
            node: sel.finalNode,
            text: sel.finalNode.textContent ?? ''
        }

        return new CursorSnapshot(initial, final, wsel.isCollapsed, true)
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
