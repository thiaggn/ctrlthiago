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

    /**
     * Aplica uma mutação a uma palavra localizada pelo path.
     * @param path Caminho até a palavra.
     * @param mutate Função de mutação que recebe o escopo da palavra.
     */
    public mutateWord(path: number[], mutate: (scope: Scope<model.Word>) => void) {
        mutate(this.searchWord(path))
    }

    /**
     * Remove uma palavra e tenta combinar palavras vizinhas se possível.
     * @param p Caminho da palavra a ser removida.
     */
    public removeWord(p: number[]) {
        const word = this.searchWord(p)
        const left = word.leftSibling()
        const right = word.rightSibling()

        if (model.isWord(left) && model.isWord(right)) {
            this.combineWords(left, right)
        }

        word.removeItself()
    }

    /**
     * Combina o texto de duas palavras, se tiverem o mesmo estilo.
     * @param dst Palavra destino.
     * @param src Palavra origem.
     * @param soff Offset final em dst (opcional).
     * @param eoff Offset inicial em src (opcional).
     */
    private combineWords(dst: model.Word, src: model.Word, soff = -1, eoff = -1) {
        if (same(dst.styles, src.styles)) {
            if (soff + eoff > 0) {
                dst.text = dst.text.slice(0, soff) + src.text.slice(eoff)
            } else {
                dst.text = dst.text + src.text
            }
            this.searchWord(src.path).removeItself()
        }
    }

    /**
     * Combina duas entidades compostas se forem do tipo texto.
     * @param dst Entidade destino.
     * @param src Entidade origem.
     */
    private combine(dst: Scope, src: Scope) {
        if (model.isTextEntity(dst.entity) && model.isTextEntity(src.entity)) {
            const dlw = dst.entity.words[dst.entity.words.length - 1]
            const sfw = src.entity.words[0]

            if (dlw && sfw && same(dlw.styles, sfw.styles)) {
                this.combineWords(dlw, sfw)
            }

            for (const word of src.entity.words) {
                word.path = [...dst.entity.path, word.id]
            }

            dst.entity.words = dst.entity.words.concat(src.entity.words)
            src.removeItself()
        }
    }

    /**
     * Remove um trecho de texto contido dentro de uma única entidade de texto.
     * Preserva o que estiver fora do intervalo definido por offsets e combina
     * palavras se elas tiverem o mesmo estilo.
     *
     * @param ent A entidade de texto que contém as palavras.
     * @param sp Caminho da palavra inicial (start).
     * @param soff Offset inicial dentro da palavra inicial.
     * @param ep Caminho da palavra final (end).
     * @param eoff Offset final dentro da palavra final. Se for negativo, assume o fim do texto.
     */
    private containedRemove(ent: model.Entity, sp: number[], soff: number, ep: number[], eoff: number) {
        if (model.isTextEntity(ent)) {
            const sw = this.searchWord(sp)
            const ew = this.searchWord(ep)

            if (eoff < 0) eoff = ew.entity.text.length

            if (!areInSequence(sw.index, ew.index)) {
                sw.siblings.splice(sw.index + 1, ew.index)
            }

            const hasAnyTextLeft = (soff > 0 || eoff < ew.entity.text.length)

            if (hasAnyTextLeft && same(sw.entity.styles, ew.entity.styles)) {
                this.combineWords(sw.entity, ew.entity, soff, eoff)
            } else {
                sw.entity.text = sw.entity.text.slice(0, soff)
                ew.entity.text = ew.entity.text.slice(eoff)
            }
        }
    }

    /**
     * Mantém apenas o início da palavra até um offset.
     * @param p Caminho da palavra.
     * @param stopOffset Posição final do corte.
     */
    public keepStart(p: number[], stopOffset: number) {
        const ew = this.searchWord(p)
        ew.siblings.trimEnd(ew.index + 1)
        ew.entity.text = ew.entity.text.slice(0, stopOffset)
    }

    /**
     * Mantém apenas o final da palavra a partir de um offset.
     * @param p Caminho da palavra.
     * @param beginOffset Posição inicial do corte.
     */
    public keepEnd(p: number[], beginOffset: number) {
        const sw = this.searchWord(p)
        sw.siblings.trimStart(sw.index)
        sw.entity.text = sw.entity.text.slice(beginOffset)
    }

    /**
     * Apaga um intervalo de texto entre duas posições.
     *
     * - Se `sp` e `ep` forem o mesmo caminho, apaga diretamente dentro da mesma palavra.
     * - Se estiverem no mesmo pai, executa remoção contida.
     * - Caso contrário, remove conteúdo entre blocos e tenta combinar as extremidades.
     *
     * @param sp Caminho da palavra inicial.
     * @param soff Offset dentro da palavra inicial.
     * @param ep Caminho da palavra final.
     * @param eoff Offset dentro da palavra final.
     */
    public erase(sp: number[], soff: number, ep: number[], eoff: number) {
        if (same(sp, ep)) {
            const w = this.searchWord(sp)
            w.entity.text = textsplice(w.entity.text, soff, eoff)

        } else if (sameParent(sp, ep)) {
            const parent = this.search(parentOf(sp))
            this.containedRemove(parent.entity, sp, soff, ep, eoff)

        } else {
            const sb = this.searchComposed(rootOf(sp))
            const eb = this.searchComposed(rootOf(ep))
            if (!areInSequence(sb.index, eb.index)) {
                sb.siblings.splice(sb.index + 1, eb.index)
            }

            this.keepStart(sp, soff)
            this.keepEnd(ep, eoff)
            this.combine(sb, eb)
        }
    }


    /**
     * Busca o escopo completo da entidade dado um path.
     * @param path Caminho da entidade.
     */
    public search(path: number[]): Scope {
        return search(path, 0, this.page)
    }

    /**
     * Busca uma entidade composta e retorna seu escopo.
     * @param path Caminho da entidade.
     * @throws Se a entidade não for composta.
     */
    public searchComposed(path: number[]): Scope<model.ComposedEntity> {
        const scope = this.search(path)
        if (!model.isComposed(scope.entity)) {
            throw new Error('expected entity to be a word')
        }
        return scope as Scope<model.ComposedEntity>
    }

    /**
     * Busca uma palavra e retorna seu escopo.
     * @param path Caminho da palavra.
     * @throws Se a entidade não for uma palavra.
     */
    public searchWord(path: number[]): Scope<model.Word> {
        const scope = this.search(path)
        if (!model.isWord(scope.entity)) {
            throw new Error('expected entity to be a word')
        }
        return scope as Scope<model.Word>
    }
}


export const textStore = new TextStore()