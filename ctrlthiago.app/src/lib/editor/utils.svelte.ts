import {model} from "$lib/model";
import  {Scoped} from "$lib/editor/scope.svelte";

export function parentOf(path: number[]) {
    return path.slice(0, -1)
}

export function rootOf(path: number[]): number[] {
    return [path[0]]
}

export function idOf(path: number[]): number {
    return path[path.length-1]
}

export function findIndex(ent: model.Entity, id: number): number {
    return childrenOf(ent).findIndex(e => e.id == id)
}

export function childrenOf(ent: model.Entity): model.Entity[] {
    switch (ent.type) {
        case model.EntityType.Title:
        case model.EntityType.Paragraph:
            return ent.words

        case model.EntityType.Page:
            return ent.blocks

        default:
            throw new Error('Tried to find() on an entity that is not composed')
    }
}

// find busca diretamente entre os filhos de uma entidade
export function mustFind(ent: model.Entity, id: number): model.Entity {
    const target = childrenOf(ent).find(e => e.id == id)
    if (target == undefined) throw new Error(`Não encontrou entidade`)
    return target
}

export function search(path: number[], level: number, parent: model.Entity): Scoped {
    const siblings = childrenOf(parent)
    const index = findIndex(parent, path[level])
    const element = siblings[index]

    if (level == path.length - 1) return new Scoped(siblings, element)
    return search(path, level + 1, element)
}

export function textsplice(source: string, start: number, end: number, repl?: string): string {
    if (repl) {
        return source.slice(0, start) + repl + source.slice(end)
    }
    return source.slice(0, start) + source.slice(end)
}

export function sameParent(p1: number[], p2: number[]) {
    if (p1.length != p2.length) return false
    for (let i = 0; i < p1.length - 1; i++) {
        if (p1[i] != p2[i]) {
            return false
        }
    }
    return true
}

export function same<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length != arr2.length) return false

    for (const item of arr1) {
        if (!arr2.includes(item)) return false
    }

    return true
}

// retorna se i1 e i2 estão em sequência
export function areInSequence(i1: number, i2: number): boolean {
    return i2 - 1 == i1
}

export function pathToFirst(ent: model.ComposedEntity, path: number[] = [ent.id]): number[] {
    const children = childrenOf(ent)
    const curr = children[0]

    if (curr != undefined) path.push(curr.id)

    if (model.isComposed(curr)) {
        return pathToFirst(curr)
    }

    return path
}

export function pathToLast(ent: model.ComposedEntity, path: number[] = [ent.id]): number[] {
    const children = childrenOf(ent)
    const curr = children[children.length - 1]

    if (curr != undefined) {
        path.push(curr.id)
    }
    if (model.isComposed(curr)) {
        return pathToLast(curr)
    }
    return path
}

export class TraversalStep {
    public entity: model.ComposedEntity
    public readonly indexOfNextChild: number

    constructor(parent: model.ComposedEntity, nextIndex: number) {
        this.entity = parent
        this.indexOfNextChild = nextIndex
    }
}

export function traverse(path: number[], parent: model.ComposedEntity): TraversalStep[] {
    let level = 0
    let out: TraversalStep[] = []

    while (true) {
        const index = findIndex(parent, path[level])
        const child = childrenOf(parent)[index]
        out.push(new TraversalStep(parent, index))

        if (child.type === model.EntityType.Word) {
            if (path.length - 1 !== level) {
                throw new Error('Encountered a word entity before reaching the end of the path')
            }
            return out
        }

        level += 1
        parent = child
    }
}