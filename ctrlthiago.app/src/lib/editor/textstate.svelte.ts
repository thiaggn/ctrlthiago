import {captureSelection} from "$lib/editor/cursor";
import {handleKeyboardEvent} from "$lib/editor/handler";
import {nodemap, pathmap} from "$lib/editor/maps";

export const editorstate = function (element: HTMLElement, param: undefined) {
    const handlekeydown = async (ev: KeyboardEvent) => {
        const cursor = captureSelection(pathmap)
        if (cursor.valid) handleKeyboardEvent(ev, cursor).then()
    }

    document.addEventListener('keydown', handlekeydown)

    return {
        destroy: () => {
            document.removeEventListener('keydown', handlekeydown)
        }
    }
}

export const textstate = function (element: HTMLElement, param: { path: number[] }) {
    const child = element.firstChild as Node
    let key = param.path.join('.')

    pathmap.set(child, param.path)
    nodemap.set(param.path.join('.'), new WeakRef(child))


    return {
        update: (newParam: { path: number[] }) => {
            pathmap.delete(child)
            pathmap.set(child, newParam.path)

            nodemap.delete(key)
            const newkey = newParam.path.join('.')
            key = newkey
            nodemap.set(newkey, new WeakRef(child))
        },

        destroy: () => {
            pathmap.delete(child)
            nodemap.delete(key)
        }
    }
}

