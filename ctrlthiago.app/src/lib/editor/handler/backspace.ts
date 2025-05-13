import {tick} from "svelte";
import {focus, falseFocus} from "$lib/editor/caret";
import {model} from "$lib/model";
import {combine, remove, restyle} from "$lib/editor/rearrange";
import {EditorEvent} from "$lib/editor/event";
import {editor} from "$lib/editor/store.svelte";

export async function handleBackspace(ev: EditorEvent) {
    let target = ev.word
    let offset = ev.offset

    if (ev.offset == 0) {
        // apaga uma palavra persistente
        if (ev.word.text.length == 0) {
            const rearr = remove(ev.scope)
            if (rearr) {
                await tick()
                focus(rearr.path, rearr.offset)
            }
            return
        } else if (ev.word.styles & model.PersistantWordBit) { // remove a estilização de uma padded word
            const rearr = restyle(ev.scope, model.removePaddingStyle(ev.word.styles))
            if (rearr) {
                await tick()
                focus(rearr.path, rearr.offset)
            }
            return
        }

        // se a caret estiver no índice 0 de uma palavra, move
        // ela para a palavra anterior, no último índice.
        const left = ev.scope.left()
        if (left != undefined) {
            target = left.entity
            offset = left.entity.text.length
        } else {
            const parent = editor.parentOf(ev.word)
            const uncle = parent.left()

            if (uncle) {
                const rearr = combine(parent, uncle)
                if (rearr) {
                    await tick()
                    focus(rearr.path, rearr.offset)
                }
            }

            return
        }
    }

    const text = target.text.slice(0, offset - 1) + target.text.slice(offset)
    target.text = text
    await tick()

    if (offset == 1) {
        if (target.styles & model.PersistantWordBit) { // palavras com padding tem persistência longa e caret falsa
            const left = ev.scope.left()
            falseFocus(target.path, left?.entity.path)

        } else if (target.text.length == 0) { // palavras sem padding podem ser apagadas imediatamente
            const rearr = remove(ev.scope)
            if (rearr) {
                await tick()
                focus(rearr.path, rearr.offset)
            }
            return
        }
    } else focus(target.path, offset - 1)
}