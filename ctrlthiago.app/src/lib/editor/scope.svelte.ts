import {model} from "$lib/model";

export class SiblingScope {
    private readonly siblings: model.Entity[]

    constructor(siblings: model.Entity[]) {
        this.siblings = siblings
    }

    get length() {
        return this.siblings.length
    }

    public splice(start: number, end: number) {
        this.siblings.splice(start, end - start)
    }

    public trimEnd(beginAt: number) {
        this.siblings.splice(beginAt, this.siblings.length - beginAt)
    }

    public trimStart(stopAt: number) {
        this.siblings.splice(0, stopAt)
    }

    public indexOf(id: number): number {
        return this.siblings.findIndex((ent => ent.id == id))
    }

    public at(index: number): model.Entity {
        return this.siblings[index]
    }

    public remove(id: number) {
        const index = this.indexOf(id)
        this.siblings.splice(index, index)
    }
}

export class Scope<E extends model.Entity = model.Entity> {
    public siblings: SiblingScope
    public entity: E

    constructor(siblings: model.Entity[], entity: E) {
        this.siblings = new SiblingScope(siblings)
        this.entity = entity
    }

    public get index() {
        return this.siblings.indexOf(this.entity.id)
    }

    public get depth(): number {
        return this.entity.path.length
    }

    public leftSibling(): model.Entity | null {
        const index = this.index
        if (index - 1 >= 0) return this.siblings.at(index - 1)
        return null
    }

    public rightSibling(): model.Entity | null {
        const index = this.index
        if (index + 1 < this.siblings.length) return this.siblings.at(index + 1)
        return null
    }

    public removeItself() {
        const index = this.index
        this.siblings.splice(index, index + 1)
    }
}
