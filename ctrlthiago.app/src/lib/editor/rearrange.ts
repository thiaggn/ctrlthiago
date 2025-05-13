import type {Scoped} from "$lib/editor/scope";
import {model} from "$lib/model";
import {current} from "immer";
import {editor} from "$lib/editor/store.svelte";

export type Rearrangement = {
    path: number[]
    offset: number
}

export function remove(scope: Scoped<model.Word>) {
    const left = scope.left()
    const len = left?.entity.text.length ?? 0
    const right = scope.right()

    if (left && right) {
        if (left.entity.styles == right.entity.styles) {
            left.entity.text += right.entity.text
            right.removeItself()
        }
    }

    scope.removeItself()

    if (left) {
        return {
            path: left.entity.path,
            offset: len
        }
    }
}

export function combine(src: Scoped, dst: Scoped) {
    if (model.isTextBased(src.entity) && model.isTextBased(dst.entity)) {

        if (src.entity.type != dst.entity.type && editor.onSafeMode) {
            return
        }

        const srcLen = src.entity.words.length
        const dstLen = dst.entity.words.length

        let rearr: Rearrangement | undefined

        if (srcLen > 0 && dstLen > 0) {
            const lastWord = dst.entity.words[dstLen-1]
            const firstWord = src.entity.words[0]

            const lastWordLength = lastWord.text.length

            if (lastWord.styles == firstWord.styles) {
                lastWord.text += firstWord.text
                editor.searchWord(firstWord.path).removeItself()

                rearr = {
                    path: lastWord.path,
                    offset: lastWordLength,
                }
            }
        }

        dst.entity.words = dst.entity.words.concat(src.entity.words)
        src.removeItself()

        return rearr
    }
}

export function restyle(scope: Scoped<model.Word>, style: number) {
    const left = scope.left()
    const right = scope.right()

    const len = scope.entity.text.length
    const leftLen = left?.entity.text.length ?? 0

    if (left && right) {
        if (left.entity.styles == right.entity.styles && left.entity.styles == style) {
            left.entity.text += scope.entity.text + right.entity.text
            scope.removeItself()
            right.removeItself()

            return {
                path: left.entity.path,
                offset: leftLen
            }
        }
    } else if (left && left.entity.styles == style) {
        left.entity.text += scope.entity.text
        scope.removeItself()

        return {
            path: left.entity.path,
            offset: leftLen
        }

    } else if (right && right.entity.styles == style) {
        scope.entity.text += right.entity.text
        right.removeItself()

        return {
            path: scope.entity.path,
            offset: len
        }

    } else {
        scope.entity.styles = style
    }
}