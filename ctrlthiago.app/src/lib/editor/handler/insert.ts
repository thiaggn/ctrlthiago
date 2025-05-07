import {type ActionHandler} from "$lib/editor/binder.svelte.js";
import {model} from "$lib/model";
import type {Scoped} from "../scope.svelte";
import {tick} from "svelte";
import {TextEvent} from "$lib/editor/event";
import {BaseHandler} from "$lib/editor/handler/base";


export class CharacterKeyHandler extends BaseHandler implements ActionHandler {
    async handle(ev: TextEvent) {
        if (ev.isCollapsed()) {
            if (ev.word.marked) {
                ev.word.marked = false
                ev.word.text = ev.key
                await tick()
                this.focus(ev.word, 1)
            } else {
                ev.word.text = this.insertAt(ev.word.text, ev.offset, ev.key)
                await tick()
                this.focus(ev.word, ev.offset + 1)
            }
        }
    }

    private insertAt(str: string, index: number, other: string): string {
        return str.slice(0, index) + other + str.slice(index)
    }
}