import {model} from "$lib/model";

export class SiblingScope<E extends model.Entity = model.Entity> {
    private readonly siblings: E[]

    public underlying(): E[] {
        return this.siblings
    }

    constructor(siblings: E[]) {
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

    public at(index: number): E {
        return this.siblings[index]
    }

    public remove(id: number) {
        const index = this.indexOf(id)
        this.siblings.splice(index, index)
    }
}

export class Scoped<E extends model.Entity = model.Entity> {
    public siblings: SiblingScope<E>
    public entity: E

    constructor(siblings: E[], entity: E) {
        this.siblings = new SiblingScope<E>(siblings)
        this.entity = entity
    }

    public get index() {
        return this.siblings.indexOf(this.entity.id)
    }

    public get depth(): number {
        return this.entity.path.length
    }

    public unwrap(): E {
        return this.entity
    }

    public left(): Scoped<E> | undefined {
        const index = this.index
        if (index > 0) {
            return new Scoped<E>(this.siblings.underlying(), this.siblings.at(index - 1))
        }
        return undefined
    }

    public right(): Scoped<E> | undefined {
        const index = this.index
        if (index + 1 < this.siblings.length) {
            return new Scoped<E>(this.siblings.underlying(), this.siblings.at(index + 1))
        }
        return undefined
    }

    public removeItself() {
        const index = this.index
        this.siblings.splice(index, index + 1)


    }
}
