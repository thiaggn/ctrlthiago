import {nodeFromPath} from "$lib/editor/maps";

export class Cursor {
    valid: boolean = false

    path = {start: [0], end: [0]}
    offset = {start: 0, end: 0}
    text = {start: "", end: ""}
    node = {start: document.createTextNode('') as Node, end: document.createTextNode('') as Node}

    public startId() {
        return this.path.start[this.path.start.length-1]
    }

    public endId() {
        return this.path.end[this.path.end.length-1]
    }

    public atStart(): boolean {
        const bothAreZero = this.offset.start == 0 && this.offset.end == 0
        return bothAreZero && this.isCollapsed()
    }

    public atEnd(): boolean{
        const length = this.text.start.length
        const bothAtEnd = this.offset.start == length && this.offset.end == length
        return bothAtEnd && this.isCollapsed()
    }

    // se está colapsado dentro da mesma palavra
    public isCollapsed(): boolean {
        const sameoffset = this.offset.start == this.offset.end
        return sameoffset && this.isContained()
    }

    // se é dentro da mesma palavra
    public isContained(): boolean {
        if (this.path.start.length != this.path.end.length) return false
        return this.path.start.every((v, i) => this.path.end[i] == v)
    }

    public revert(off: number = 0) {
        const sel = window.getSelection()
        if (sel) {
            sel.removeAllRanges()
            const range = document.createRange()
            range.setStart(this.node.start, this.offset.start + off)
            range.setEnd(this.node.start, this.offset.start + off)
            sel.addRange(range)
        }
    }

    public replace(path: number[], offset: number): Cursor {
        const node = nodeFromPath(path)
        this.valid = true
        this.path.start = path
        this.path.end = path
        this.node.start = node
        this.node.end = node
        this.offset.start = offset
        this.offset.end = offset

        return this
    }
}

export function captureSelection(pathmap: WeakMap<Node, number[]>): Cursor {
    const cursor = new Cursor()

    const sel = getSelection()

    if (sel == undefined || sel.anchorNode == undefined || sel.focusNode == undefined) {
        cursor.valid = false
        return cursor
    }

    const [startnode, startoff, endnode, endoff] = reorder(
        sel.anchorNode, sel.anchorOffset,
        sel.focusNode, sel.focusOffset
    )

    cursor.node.start = startnode
    cursor.node.end = endnode

    cursor.text.start = startnode.textContent!
    cursor.text.end = endnode.textContent!

    const startPath = pathmap.get(startnode)
    const endPath = pathmap.get(endnode)

    if (startPath == undefined || endPath == undefined) {
        cursor.valid = false
        return cursor
    }

    cursor.path.start = startPath
    cursor.offset.start = startoff
    cursor.path.end = endPath
    cursor.offset.end = endoff
    cursor.valid = true
    return cursor
}

function reorder(a: Node, offA: number, b: Node, offB: number): [Node, number, Node, number] {
    const comp = a.compareDocumentPosition(b)

    if (a === b) {
        return offA <= offB
            ? [a, offA, b, offB]
            : [b, offB, a, offA]
    }

    if (comp & Node.DOCUMENT_POSITION_FOLLOWING) {
        return [a, offA, b, offB]
    }

    return [b, offB, a, offA]
}
