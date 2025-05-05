import {nodemap, pathmap} from "$lib/editor/maps";
import {registerListeners} from "$lib/editor/listener/events.svelte";

export const editorstate = function (element: HTMLElement, param: undefined) {
    registerListeners(pathmap)
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

