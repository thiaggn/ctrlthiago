const pathMap = new WeakMap<Node, number[]>
const refMap = new Map<string, Reference>

type Reference = {
    textNode: WeakRef<Node>
    elementNode: WeakRef<HTMLElement>
}

export function getNode(path: number[]): Node {
    const ref = refMap.get(path.join('.'))
    if (ref == undefined) throw new Error()
    const node = ref.textNode.deref()
    if (node == undefined) throw new Error()
    return node
}

export function getElement(path: number[]): HTMLElement {
    const ref = refMap.get(path.join('.'))
    if (ref == undefined) throw new Error()
    const el = ref.elementNode.deref()
    if (el == undefined) throw new Error()
    return el
}

export function bindReference(node: Node, el: HTMLElement, path: number[]) {
    const key = path.join('.')
    pathMap.set(node, path)
    refMap.set(key, {
        textNode: new WeakRef(node),
        elementNode: new WeakRef(el)
    })
}

export function unbindReference(node: Node, path: number[]) {
    const key = path.join('.')
    pathMap.delete(node)
    refMap.delete(key)
}

export function updateReference(node: Node, el: HTMLElement, oldPath: number[], path: number[]) {
    unbindReference(node, oldPath)
    bindReference(node, el, path)
}

export function getPath(node: Node): number[] | undefined {
    return pathMap.get(node)
}