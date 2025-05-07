export namespace model {

    export enum Visibility {
        Public = 9,
        Private = 3
    }

    export const visibilityToText = (v: Visibility): string => {
        switch (v) {
            case Visibility.Private:
                return 'Privado'

            case Visibility.Public:
                return 'Público'

            default:
                throw new Error('unhandled visibility')
        }
    }

    export type Post = {
        id: number
        collectionId: number
        visibility: Visibility
        title: string
        views: number
        comments: number
    }

    export type PostHeader = Omit<Post, 'blocks' | 'collectionId'>

    export type Collection = {
        id: number
        visibility: Visibility
        title: string
        views: number
        comments: number
        posts: PostHeader[]
    }

    export type CollectionHeader = Omit<Collection, 'posts'>

    export enum EntityType {
        Word = 'w',
        Paragraph = 'p',
        Title = 't',
        Page = 'pg',
        Table = 't',
        Grid = 'g',
        Area = 'a',
        Column = 'c',
        Row = 'r',
        Code = 'd'
    }

    export type Page = {
        path: []
        id: 0
        type: EntityType.Page
        blocks: model.Block[]
    }

    export type Block = Paragraph | Title

    export type Entity = Paragraph | Title | Word | Page

    export type ComposedEntity = Exclude<Entity, Word>

    export type TextEntity = Paragraph | Title

    export function isTextEntity(ent: Entity): ent is TextEntity {
        switch (ent.type) {
            case EntityType.Paragraph:
            case EntityType.Title:
                return true
            default:
                return false
        }
    }

    export function isComposed(ent: Entity): ent is ComposedEntity {
        switch (ent.type) {
            case EntityType.Word:
                return false
            default:
                return true
        }
    }

    export function isWord(ent: Entity | undefined | null): ent is Word {
        if (ent === undefined || ent === null) return false
        return ent.type == EntityType.Word
    }

    export enum WordStyle {
        Bold = 'b',
        Italic = 'i',
        Code = 'c'
    }

    export type Paragraph = {
        id: number
        type: EntityType.Paragraph
        words: Word[]
        path: number[]
    }

    export type Title = {
        id: number
        type: EntityType.Title
        size: 1 | 2 | 3
        words: Word[]
        path: number[]
    }

    export type Word = {
        id: number
        type: EntityType.Word
        text: string
        styles: WordStyle[]
        marked: boolean
        path: number[]
    }
}
