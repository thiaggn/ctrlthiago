import {model} from "$lib/model";

export namespace dto {
    export type Post = {
        relatedCollections: Pick<model.Collection, 'id' | 'title' | 'visibility'>[]
        post: model.Post
        blocks: dto.Block[]
    }

    export type Block = Title | Paragraph

    export type Title = Omit<model.Title, 'path' | 'words'> & {
        words: dto.Word[]
    }

    export type Paragraph = Omit<model.Paragraph, 'path' | 'words'> & {
        words: dto.Word[]
    }

    export type Word = Omit<model.Word, 'path' | 'id' | 'styles' | 'marked'> & {
        styles?: model.WordStyle[]
    }
}