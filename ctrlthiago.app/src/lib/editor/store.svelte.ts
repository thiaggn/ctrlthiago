import {model} from "$lib/model";
import {Scope} from "$lib/editor/scope.svelte";
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
    
    public eraseWord(word: Scope<model.Word>) {
        const left = word.left()
        const right = word.right()

        if (left && right && same(left.entity.styles, right.entity.styles)) {
            left.entity.text += right.entity.text
            right.removeItself()
        }

        word.removeItself()
    }

    public updateText(word: Scope<model.Word>, value: string): boolean {
        if (value.length == 0) {
            this.eraseWord(word)
            return true
        }
        else word.entity.text = value
        return false
    }

    public search(path: number[]): Scope {
        return search(path, 0, this.page)
    }

    public getWord(path: number[]): Scope<model.Word> {
        const scope = this.search(path)
        if (!model.isWord(scope.entity)) {
            throw new Error('expected entity to be a word')
        }
        return scope as Scope<model.Word>
    }
}


export const textStore = new TextStore()