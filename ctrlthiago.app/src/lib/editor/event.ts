import type {Scoped} from "$lib/editor/scope.svelte";
import {model} from "$lib/model";
import {stateBinder} from "$lib/editor/binder.svelte";

export class TextSelection {
    private readonly _scope: Scoped<model.Word>
    public offset: number
    public node: Node

    constructor(word: Scoped<model.Word>, offset: number, node: Node) {
        this._scope = word
        this.offset = offset
        this.node = node
    }

    get word() {
        return this._scope.entity
    }

    get scope() {
        return this._scope
    }
}

export class TextEvent {
    start: TextSelection
    end: TextSelection
    key: string

    constructor(start: TextSelection, end: TextSelection, key: string) {
        this.start = start
        this.end = end
        this.key = key
    }


    public isCollapsed() {
        const samenode = this.start.node == this.end.node
        const sameoffset = this.start.offset == this.end.offset
        return samenode && sameoffset
    }

    public get word() {
        return this.start.word
    }

    public get scope() {
        return this.start.scope
    }

    public get offset() {
        return this.start.offset
    }

    public set offset(value: number) {
        this.start.offset = value
    }

}