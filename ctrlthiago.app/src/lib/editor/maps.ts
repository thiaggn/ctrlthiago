export const pathmap = new WeakMap<Node, number[]>()

export const nodemap = new Map<string, WeakRef<Node>>()

export function nodeFromPath(path: number[]): Node {
    const ref = nodemap.get(path.join('.'))
    if (ref == undefined) {
        throw new Error()
    }

    const node = ref.deref()
    if (node == undefined) {
        throw new Error()
    }

    return node
}