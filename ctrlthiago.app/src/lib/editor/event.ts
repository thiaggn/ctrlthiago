import {Edge} from "$lib/editor/listeners";

export class EditorEvent {
    readonly start: Edge
    readonly end: Edge

    constructor(start: Edge, end: Edge) {
        this.start = start
        this.end = end
    }

    get word() {
        return this.start.scope.entity
    }

    get scope() {
        return this.start.scope
    }

    get offset() {
        return this.start.offset
    }
}

export class RemoveEvent extends EditorEvent {

}

export class ArrowEvent extends EditorEvent {
    direction: 'left' | 'right'
    preventDefault: () => void

    constructor(ev: KeyboardEvent, start: Edge, end: Edge, direction: 'left' | 'right') {
        super(start, end);
        this.direction = direction
        this.preventDefault = () => {
            ev.preventDefault()
        }
    }
}

export class InsertEvent extends EditorEvent {
    readonly char: string

    constructor(start: Edge, end: Edge, char: string) {
        super(start, end);
        this.char = char
    }
}