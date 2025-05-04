import {Cursor} from "$lib/editor/cursor";
import {textStore} from "$lib/editor/store.svelte";
import {model} from "$lib/model";
import {tick} from "svelte";
import {textsplice} from "$lib/editor/utils.svelte";

export async function handleKeyboardEvent(ev: KeyboardEvent, cursor: Cursor) {
    if (ev.key.length == 1) {
        if (!ev.ctrlKey) {
            ev.preventDefault()
            await typing(ev, cursor) // inserção
        }

    } else if (ev.key == 'Backspace' || ev.key == 'Delete') {
        ev.preventDefault()
        // mesma palavra, mesmo offset
        if (cursor.isCollapsed()) {
            if (cursor.text.start.length == 0) { // remoção
                await destroy(cursor)
            } else if (ev.key == 'Backspace') { // remoção
                await backspaceKey(cursor)
            } else if (ev.key == 'Delete') { // remoção
                await deleteKey(cursor)
            }
        }
        // mesma palavra, offset distinto
        else if (cursor.isContained()) await containedRemove(cursor)
        // palavra ou bloco distinto
        else await rangeRemove(cursor)

    } else if (ev.key == 'Enter') {
        ev.preventDefault()
    }
}

function textStoreErase(cursor: Cursor, s_off_add: number, e_off_add: number, keep = false) {
    textStore.erase(
        cursor.path.start, cursor.offset.start + s_off_add,
        cursor.path.end, cursor.offset.end + e_off_add,
    )
}

function updateWordText(cursor: Cursor, value: string) {
    textStore.mutateWord(cursor.path.start, (scope) => {
        scope.entity.text = value
    })
}

async function typing(ev: KeyboardEvent, cursor: Cursor) {
    if (cursor.isCollapsed()) {
        updateWordText(cursor, insert(cursor.text.start, cursor.offset.start, ev.key))

    } else if (cursor.isContained()) {
        updateWordText(cursor, textsplice(cursor.text.start, cursor.offset.start, cursor.offset.end, ev.key))
    }
    await tick()
    cursor.revert(+1)
}

async function destroy(cursor: Cursor) {
    const word = textStore.searchWord(cursor.path.start)
    let path: number[] = []
    let offset: number = 0

    const left = word.leftSibling()
    if (model.isWord(left)) {
        path = left.path
        offset = left.text.length
    } else {
        const right = word.rightSibling()
        if (model.isWord(right)){
            path = right.path
        }
    }

    textStore.removeWord(cursor.path.start)
    await tick()
    cursor.replace(path, offset).revert()
}

async function backspaceKey(cursor: Cursor) {
    if (cursor.atStart()) {
        const scope = textStore.search(cursor.path.start)
        const left = scope.leftSibling()
        if (left) {
            if (left.type != model.EntityType.Word) {
                throw new Error('expected left sibling to be a word')
            }

            cursor.replace(left.path, left.text.length).revert()
        } else {
            // unir com o bloco à esquerda
            return
        }
    }

    textStoreErase(cursor, -1, 0, true)
    await tick()
    cursor.revert(-1)
}

async function deleteKey(cursor: Cursor) {
    if (cursor.atEnd()) {
        const scope = textStore.search(cursor.path.start)
        const right = scope.rightSibling()
        if (right) {
            if (right.type != model.EntityType.Word) {
                throw new Error('expected right sibling to be a word')
            }
            cursor.replace(right.path, 0).revert()
        } else {
            // unir com o bloco à direita
            return
        }
    }

    textStoreErase(cursor, 0, +1, true)
    await tick()
    cursor.revert()
}

async function containedRemove(cursor: Cursor) {
    textStoreErase(cursor, 0, 0, true)
    await tick()
    cursor.revert()
}

async function rangeRemove(cursor: Cursor,) {
    textStoreErase(cursor, 0, 0, false)
    await tick()
    cursor.revert()
}

function insert(source: string, pos: number, value: string): string {
    const s = source.slice(0, pos)
    const e = source.slice(pos)
    return s + value + e
}

