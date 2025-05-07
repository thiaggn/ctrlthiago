import {RangeCursor, Tracker} from "$lib/editor/cursor";
import {stateBinder} from "$lib/editor/binder.svelte";
import {model} from "$lib/model";
import type {Scoped} from "$lib/editor/scope.svelte";

class SelectionListener {
    private elements: Map<string, WeakRef<HTMLElement>>
    private withCaret: HTMLElement | undefined
    private withoutCaret: HTMLElement | undefined

    constructor() {
        this.elements = new Map()
        this.withCaret = undefined
        this.withoutCaret = undefined
    }

    private removeStyles() {
        if (this.withCaret) this.withCaret.classList.remove('caret')
        if (this.withoutCaret) this.withoutCaret.classList.remove('hiddenCaret')
    }

    public start() {
        document.addEventListener('keydown', (ev) => {
            this.removeStyles()

            const ctx = this.process(ev)

            if (!ctx || ev.ctrlKey || ev.shiftKey) return

            if (ev.key == 'ArrowLeft' || ev.key == 'Backspace') {
                this.tryLeft(ev, ctx.word, ctx.cursor, ctx.element)
            }

            if (ev.key == 'ArrowRight' || ev.key == 'Delete') {
                this.tryRight(ev, ctx.word, ctx.cursor, ctx.element)
            }
        })

        document.addEventListener('click', () => {
            this.removeStyles()
        })
    }

    public getBinder() {
        return this.bindElement.bind(this)
    }

    private bindElement(element: HTMLElement, params: { path: number[] }) {
        let key = params.path.join('.')
        this.elements.set(key, new WeakRef(element))

        return {
            update: (newParams: { path: number[] }) => {
                this.elements.delete(key)
                key = newParams.path.join('.')
                this.elements.set(key, new WeakRef(element))
            },

            destroy: () => {
                this.elements.delete(key)
            }
        }
    }

    protected focus(word: model.Word, position: number) {
        const node = stateBinder.nodeFromPath(word.path)
        const sel = window.getSelection()
        if (sel) {
            sel.removeAllRanges()
            const range = document.createRange()
            range.setStart(node, position)
            range.setEnd(node, position)
            sel.addRange(range)
        }
    }

    private process(ev: KeyboardEvent) {
        const cursor = Tracker.now()
        if (!cursor.isCollapsed) {
            return
        }

        const word = stateBinder.tryGetWordFromNode(cursor.start.node)
        if (word == undefined) {
            return
        }

        const ref = this.elements.get(word.entity.path.join('.'))
        if (ref == undefined) {
            return
        }

        const element = ref.deref()
        if (element == undefined) {
            return
        }

        return {word, cursor, element}
    }

    private getScopeAndElement(scope: Scoped<model.Word> | undefined) {
        if (scope == undefined) return undefined

        const ref = this.elements.get(scope.entity.path.join('.'))
        if (ref == undefined) {
            return undefined
        }

        let element = ref.deref()
        if (element != undefined) {
            return {
                element: element,
                scope: scope
            }
        }

        return undefined
    }

    private tryLeft(ev: KeyboardEvent, word: Scoped<model.Word>, cursor: RangeCursor, element: HTMLElement) {
        const left = this.getScopeAndElement(word.left())
        if (left == undefined) {
            return
        }

        const currHasCodeStyle = word.entity.styles.includes(model.WordStyle.Code)
        if (currHasCodeStyle) {
            let offset = cursor.start.offset

            if (offset == 1) {
                const curr = this.getScopeAndElement(word)
                if (curr) {
                    if (ev.key != 'Backspace') ev.preventDefault()
                    this.focus(curr.scope.entity, 0)
                    this.stylize(element, left.element)
                }
            } else if (offset == 0) {
                if (ev.key != 'Backspace') ev.preventDefault()
                this.focus(left.scope.entity, left.scope.entity.text.length)
            }
        }
    }

    private tryRight(ev: Event, word: Scoped<model.Word>, cursor: RangeCursor, element: HTMLElement) {
        const right = this.getScopeAndElement(word.right())
        if (right == undefined) {
            return
        }

        const atEnd = (cursor.start.offset) == word.entity.text.length
        const rightIsCode = right.scope.entity.styles.includes(model.WordStyle.Code)
        const currHasCodeStyle = !word.entity.styles.includes(model.WordStyle.Code)

        if (atEnd && rightIsCode && currHasCodeStyle) {
            ev.preventDefault()
            this.stylize(right.element, element)
            this.focus(right.scope.entity, 0)
        }
    }

    private stylize(caretEl: HTMLElement, caretHiddenEl?: HTMLElement) {
        caretEl.classList.add('caret')
        caretHiddenEl?.classList.add('hiddenCaret')
        this.withCaret = caretEl
        this.withoutCaret = caretHiddenEl
    }
}

export const selectionListener = new SelectionListener()