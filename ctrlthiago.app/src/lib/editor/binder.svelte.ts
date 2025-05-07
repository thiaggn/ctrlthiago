import {RangeCursor, Tracker} from "$lib/editor/cursor";
import type {Scoped} from "$lib/editor/scope.svelte.js";
import {model} from "$lib/model";
import {DeleteKeyHandler} from "$lib/editor/handler/delete";
import {BackspaceKeyHandler} from "$lib/editor/handler/backspace";
import {RemoveKeyHandler} from "$lib/editor/handler/remove";
import {CharacterKeyHandler} from "$lib/editor/handler/insert";
import {textStore} from "$lib/editor/store.svelte";
import {TextSelection, TextEvent} from "$lib/editor/event";
import {selectionListener} from "$lib/editor/selection";


export interface ActionHandler {
    handle(c: TextEvent): void
}

export enum EventTrigger {
    Backspace,
    Delete,
    Remove,
    Insert,
    None,
}

export class StateBinder {
    private paths: WeakMap<Node, Path>
    private nodes: Map<string, WeakRef<Node>>
    private handlers: Map<EventTrigger, ActionHandler>

    constructor() {
        this.paths = new WeakMap()
        this.nodes = new Map()
        this.handlers = new Map()
        this.mapHandlers()
        console.log(document)
        document.addEventListener('keydown', this.listener.bind(this))
    }

    private mapHandlers() {
        this.handlers.set(EventTrigger.Delete, new DeleteKeyHandler())
        this.handlers.set(EventTrigger.Backspace, new BackspaceKeyHandler())
        this.handlers.set(EventTrigger.Remove, new RemoveKeyHandler())
        this.handlers.set(EventTrigger.Insert, new CharacterKeyHandler())
    }

    private detectAction(cursor: RangeCursor, ev: KeyboardEvent): EventTrigger {
        if (ev.key == 'Backspace') {
            if (cursor.isCollapsed) return EventTrigger.Backspace
            else return EventTrigger.Remove
        } else if (ev.key == 'Delete') {
            if (cursor.isCollapsed) return EventTrigger.Delete
            else return EventTrigger.Remove
        } else if (ev.key.length == 1) {
            return EventTrigger.Insert
        }

        return EventTrigger.None
    }

    public tryGetWordFromNode(node: Node): undefined | Scoped<model.Word> {
        const p = this.paths.get(node)
        if (p == undefined) return undefined
        return textStore.getWord(p.path)
    }

    private getNodeWord(node: Node): Scoped<model.Word> {
        const p = this.paths.get(node)
        if (p == undefined) {
            console.error(node)
            throw new Error()
        }
        return textStore.getWord(p.path)
    }

    public listener(ev: KeyboardEvent) {
        const cursor = Tracker.now()
        const handler = this.handlers.get(this.detectAction(cursor, ev))

        if (handler) {
            ev.preventDefault()

            handler.handle(new TextEvent(
                new TextSelection(this.getNodeWord(cursor.start.node), cursor.start.offset, cursor.start.node),
                new TextSelection(this.getNodeWord(cursor.end.node), cursor.end.offset, cursor.end.node),
                ev.key
            ))
        }
    }

    public nodeFromPath(path: number[]): Node {
        const ref = this.nodes.get(path.join('.'))
        if (ref == undefined) throw new Error('unknown node')
        const node = ref.deref()
        if (node == undefined) throw new Error('collected node')
        return node
    }

    private bindElement(element: HTMLElement, params: { path: number[] }) {
        const node = element.firstChild as Node
        let key = params.path.join('.')

        this.paths.set(node, new Path(params.path))
        this.nodes.set(key, new WeakRef<Node>(node))

        return {
            update: (newParam: { path: number[] }) => {
                const tx = this.paths.get(node)
                if (tx) {
                    tx.path = newParam.path
                }

                this.nodes.delete(key)
                key = newParam.path.join('.')
                this.nodes.set(key, new WeakRef(node))
            },

            destroy: () => {
                this.paths.delete(node)
                this.nodes.delete(key)
            }
        }
    }

    public getBinder(): (element: HTMLElement, params: { path: number[] }) => void {
        return this.bindElement.bind(this)
    }
}

class Path {
    path: number[]

    constructor(paths: number[]) {
        this.path = paths
    }
}

export const stateBinder = new StateBinder()