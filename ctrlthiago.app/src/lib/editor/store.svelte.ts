import {model} from "$lib/model";
import {Scoped} from "$lib/editor/scope";
import EntityType = model.EntityType;

class EditorState {
    private page: model.Page = $state({
        path: [],
        id: 0,
        type: EntityType.Page,
        blocks: []
    })

    private _onSafeMode: boolean = $state(true)

    get onSafeMode() {
        return this._onSafeMode
    }

    public toggleSafeMode() {
        this._onSafeMode = !this._onSafeMode
    }

    get blocks() {
        return this.page.blocks
    }

    public setBlocks(b: model.Block[]) {
        this.page.blocks = b
    }

    public getBlocks() {
        return this.blocks
    }

    public _searchEntity(path: number[], level: number, parent: model.Entity): Scoped {
        const siblings = this.childrenOf(parent)
        const index = this.findIndex(parent, path[level])
        const element = siblings[index]

        if (level == path.length - 1) return new Scoped(siblings, element)
        return this._searchEntity(path, level + 1, element)
    }

    public searchEntity(path: number[]) {
        return this._searchEntity(path, 0, this.page)
    }

    public searchWord(path: number[]) {
        const scope = this._searchEntity(path, 0, this.page)
        if (scope.entity.type == EntityType.Word) {
            return scope as Scoped<model.Word>
        }

        throw new Error()
    }

    private findIndex(ent: model.Entity, id: number): number {
        return this.childrenOf(ent).findIndex(e => e.id == id)
    }

    public parentOf(ent: model.Entity): Scoped {
        return this._searchEntity(ent.path.slice(0, -1), 0, this.page)
    }

    private childrenOf(ent: model.Entity): model.Entity[] {
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
}

export const editor = new EditorState()

