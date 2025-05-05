import {CursorSnapshot, Tracker} from "$lib/editor/listener/cursor";
import {model} from "$lib/model";
import type {Scope} from "$lib/editor/scope.svelte";
import {textStore} from "$lib/editor/store.svelte";
import {tick} from "svelte";
import {textsplice} from "$lib/editor/utils.svelte";

export enum UserAction {
    Backspace,          // backspace 1 caractere
    BackspaceAtStart,   // backspace 1 caractere no fim da palavra

    Delete,             // delete 1 caractere
    DeleteAtEnd,        // delete 1 caractere no fim da palavra

    Remove,             // remove +1 caractere numa palavra
    RemoveBetweenWords, // remove +1 caractere entre palavras
    RemoveAcrossBlocks,       // remove +1 caractere entre palavras de blocos diferentes

    Insert,
    None,
}

async function handleEvent(ac: UserAction, c: CursorSnapshot, iw: Scope<model.Word>, ew: Scope<model.Word>) {
    switch (ac) {
        case UserAction.BackspaceAtStart: {
            const left = iw.left()
            if (left) {
                c.replace(left.entity.path, left.entity.text.length).revert()
                iw = left
            } else {
                // juntar com o bloco de cima
                break
            }
        }

        case UserAction.Backspace: {
            // salva a word irmã à esquerda e o seu comprimento
            const left = iw.left()
            let offset = left?.entity.text.length ?? 0

            // atualiza o texto
            const t = iw.entity.text
            const didRemove = textStore.updateText(iw, t.slice(0, c.initial.offset - 1) + t.slice(c.final.offset))

            // se houve remoção, recupera a posição ideal
            await tick()
            if (didRemove) {
                if (left) c.replace(left.entity.path, offset + 1).revert()
                else return
            }
            c.revert(-1)
            break
        }

        case UserAction.DeleteAtEnd: {
            const right = iw.right()
            if (right) {
                c.replace(right.entity.path, 0).revert()
                iw = right
            } else {
                // juntar com o bloco de baixo
                break
            }
        }

        case UserAction.Delete: {
            // obtém a word irmã à esquerda e o seu comprimento
            const left = iw.left()
            let offset = left?.entity.text.length ?? 0

            // atualiza o texto
            const t = iw.entity.text
            const didRemove = textStore.updateText(iw, t.slice(0, c.initial.offset) + t.slice(c.final.offset + 1))

            // se houve remoção, recupera a posição ideal
            await tick()
            if (didRemove) {
                if (left) c.replace(left.entity.path, offset)
                else return
            }
            c.revert()
        }

        case UserAction.Remove:
            const text = iw.entity.text
            textStore.updateText(iw, text.slice(0, c.initial.offset) + text.slice(c.final.offset))
            await tick()
            c.revert()
            break

        case UserAction.RemoveBetweenWords:
            break

        case UserAction.RemoveAcrossBlocks:
            break

        case UserAction.Insert:
            break

    }
}

export function registerListeners(pathmap: WeakMap<Node, number[]>) {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
        const cursor = Tracker.now()

        const ipath = pathmap.get(cursor.initial.node)
        const fpath = pathmap.get(cursor.final.node)

        if (ipath == undefined || fpath == undefined) {
            return
        }

        const iword = textStore.getWord(ipath)
        const eword = textStore.getWord(fpath)
        const action = identifyEvent(ev.key, cursor, iword, eword)

        if (action != UserAction.None) {
            ev.preventDefault()
            handleEvent(action, cursor, iword, eword).catch(err => {
                throw err
            })
        }
    })
}

function identifyEvent(key: string, c: CursorSnapshot, iw: Scope<model.Word>, fw: Scope<model.Word>) {
    const sameEntity = iw.entity.id === fw.entity.id;
    const sameParentPath = sameParent(iw.entity.path, fw.entity.path);

    const isBackspace = key === 'Backspace';
    const isDelete = key === 'Delete';

    if (isBackspace || isDelete) {
        if (c.isCollapsed) {
            if (isBackspace) {
                if (c.offset === 0) return UserAction.BackspaceAtStart;
                else return UserAction.Backspace;
            }
            if (isDelete) {
                if (c.offset === iw.entity.text.length) return UserAction.DeleteAtEnd;
                else return UserAction.Delete;
            }
        }

        if (sameEntity) return UserAction.Remove;
        if (sameParentPath) return UserAction.RemoveBetweenWords;
        return UserAction.RemoveAcrossBlocks;
    } else if (key.length == 1) {
        return UserAction.Insert
    } else return UserAction.None
}

function sameParent(p1: number[], p2: number[]): boolean {
    if (p1.length != p2.length) return false
    if (p1.length < 2 && p2.length < 2) return true
    return p1[p1.length - 2] == p2[p2.length - 2]
}