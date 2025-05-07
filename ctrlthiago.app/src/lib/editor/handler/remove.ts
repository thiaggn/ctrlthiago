import {type ActionHandler} from "$lib/editor/binder.svelte.js";
import type {model} from "$lib/model";
import type {RangeCursor} from "../cursor";
import type {Scoped} from "../scope.svelte";
import {textStore} from "$lib/editor/store.svelte";
import {tick} from "svelte";
import {TextEvent} from "$lib/editor/event";

export class RemoveKeyHandler implements ActionHandler {
    handle(c: TextEvent): void {

    }
}