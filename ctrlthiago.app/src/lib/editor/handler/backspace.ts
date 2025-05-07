import {type ActionHandler} from "$lib/editor/binder.svelte.js";
import {tick} from "svelte";
import {BaseHandler} from "$lib/editor/handler/base";
import {TextEvent} from "$lib/editor/event";
import type {Scoped} from "$lib/editor/scope.svelte";
import {model} from "$lib/model";

export class BackspaceKeyHandler extends BaseHandler implements ActionHandler {
    public async handle(ev: TextEvent): Promise<void> {
        if (ev.isCollapsed()) {
            return this.handleCollapsed(ev)
        }
    }

    private async handleCollapsed(ev: TextEvent) {
        const left = ev.scope.left()
        const right = ev.scope.right()

        if (ev.offset == 0) {


        }
        if (ev.offset == 1) {
            if (ev.word.text.length > 1) {
                await this.handleCollapsedAfterStart(ev)
                this.focus(ev.word, 0)
            }
        } else {
            await this.handleCollapsedAfterStart(ev)
        }
    }

    private async handleCollapsedAfterStart(ev: TextEvent) {
        const og = ev.word.text
        ev.word.text = og.slice(0, ev.offset - 1) + og.slice(ev.offset)
        await tick()
        this.focus(ev.word, ev.offset - 1)
    }
}