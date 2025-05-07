import {model} from "$lib/model";
import type {Scoped} from "$lib/editor/scope.svelte";
import {same} from "$lib/editor/utils.svelte";
import {stateBinder} from "$lib/editor/binder.svelte";
import {tick} from "svelte";

class Rearrangement {
    scope: Scoped<model.Word>
    length: number

    constructor(scope: Scoped<model.Word>, length: number) {
        this.scope = scope
        this.length = length
    }
}

export class BaseHandler {
    protected isPersistant(word: model.Word): boolean {
        return word.styles.length > 0
    }

    protected removeWord(scope: Scoped<model.Word>) {
        const left = scope.left()
        const right = scope.right()

        if (left && right && same(left.entity.styles, right.entity.styles)) {
            left.entity.text += right.entity.text
            right.removeItself()
        }

        scope.removeItself()
    }

    private combineWords(dest: Scoped<model.Word>, ...sources: Scoped<model.Word>[]) {
        for (const source of sources) {
            dest.entity.text += source.entity.text
            source.removeItself()
        }
    }

    protected async changeStyle(word: Scoped<model.Word>, offset: number, styles: model.WordStyle[]) {
        const left = word.left()
        const right = word.right()
        word.entity.styles = styles

        if (left && right) {
            if (this.sameStyle(left, right) && this.sameStyle(word, left)) {
                const len = left.entity.text.length
                this.combineWords(left, word, right)
                await tick()
                this.focus(left.entity, len + offset)
            }
        } else if (left && this.sameStyle(word, left)) {
            throw new Error('faltou implementar')
            // this.combineWords(word, left)

        } else if (right && this.sameStyle(word, right)) {
            throw new Error('faltou implementar')
            // this.combineWords(word, right)
        }
    }

    private sameStyle(w1: Scoped<model.Word>, w2: Scoped<model.Word>): boolean {
        if (w1.entity.styles.length != w2.entity.styles.length) return false
        return w1.entity.styles.every((s, i) => s == w2.entity.styles[i])
    }

    protected focus(word: model.Word, offset: number) {
        const node = stateBinder.nodeFromPath(word.path)

        const sel = window.getSelection()
        if (sel) {
            sel.removeAllRanges()
            const range = document.createRange()
            range.setStart(node, offset)
            range.setEnd(node, offset)
            sel.addRange(range)
        }
    }

    protected isCode(word: model.Word): boolean {
        return word.styles.includes(model.WordStyle.Code)
    }
}