import {model} from "$lib/model";
import {Scoped} from "$lib/editor/scope.svelte";
import {
    areInSequence,
    rootOf,
    parentOf,
    sameParent,
    same,
    textsplice,
    search,
} from "$lib/editor/utils.svelte";


const defaultPageState: model.Page = {
    path: [],
    id: 0,
    type: model.EntityType.Page,
    blocks: []
}


class TextStore {
    page: model.Page = $state(defaultPageState)

    set blocks(blocks: model.Block[]) {
        this.page.blocks = blocks
    }

    get blocks() {
        return this.page.blocks
    }

    public setBlocks(blocks: model.Block[]) {
        this.blocks = blocks
    }

    public search(path: number[]): Scoped {
        return search(path, 0, this.page)
    }

    public getWord(path: number[]): Scoped<model.Word> {
        const scope = this.search(path)
        if (!model.isWord(scope.entity)) {
            throw new Error('expected entity to be a word')
        }
        return scope as Scoped<model.Word>
    }

    public getStatelessWord(path: number[]): model.Word{
        return $state.snapshot(this.getWord(path).entity)
    }
}


export const textStore = new TextStore()