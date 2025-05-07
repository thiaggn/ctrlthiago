import {type ActionHandler} from "$lib/editor/binder.svelte.js";
import type { model } from "$lib/model";
import type { RangeCursor } from "../cursor";
import type { Scoped } from "../scope.svelte";
import {TextEvent} from "$lib/editor/event";

export class DeleteKeyHandler implements ActionHandler {
    public handle(c: TextEvent): void {
        throw new Error("Method not implemented.");
    }
}