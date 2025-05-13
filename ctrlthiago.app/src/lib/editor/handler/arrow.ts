import type {ArrowEvent} from "$lib/editor/event";
import {model} from "$lib/model";
import {falseFocus, focus} from "$lib/editor/caret";

export function handleArrow(ev: ArrowEvent) {
    if (ev.direction == 'right') {
        const right = ev.scope.right()

        if (right && (right.entity.styles & model.PersistantWordBit)) {
            if (ev.offset == ev.word.text.length) {
                ev.preventDefault()
                focus(right.entity.path, 0)
                falseFocus(right.entity.path, ev.word.path)
            }
        }

    } else if (ev.direction == 'left') {
        const left = ev.scope.left()

        if (left && (ev.word.styles & model.PersistantWordBit)) {

            if (ev.offset == 1) {
                ev.preventDefault()
                focus(ev.word.path, 0)
                falseFocus(ev.word.path, left?.entity.path)

            } else if (ev.offset == 0) {
                ev.preventDefault()
                focus(left.entity.path, left.entity.text.length)
            }
        }
    }
}
