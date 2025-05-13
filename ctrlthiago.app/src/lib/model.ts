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

    export const TerminalEntity = 1 << 1
    export const TextEntityBit = 1 << 2 | TerminalEntity

    export enum EntityType {
        Word      = 1 << 3 | TerminalEntity,
        Paragraph = 1 << 4 | TextEntityBit,
        Title     = 1 << 5 | TextEntityBit,
        Page      = 1 << 6,
        Table     = 1 << 7,
        Grid      = 1 << 8,
        Area      = 1 << 9,
        Column    = 1 << 10,
        Row       = 1 << 11,
        Code      = 1 << 12
    }

    export type Page = {
        path: []
        id: 0
        type: EntityType.Page
        blocks: model.Block[]
    }

    export type Block = Paragraph | Title

    export type Entity = Paragraph | Title | Word | Page

    export type TextEntity = Paragraph | Title

    export function isParagraph(ent: model.Entity): ent is Paragraph {
        return ent.type == EntityType.Paragraph
    }

    export function isTextBased(ent: model.Entity): ent is TextEntity {
        return (ent.type & TextEntityBit) != 0
    }

    export const PersistantWordBit = 1 << 15

    export enum WordStyle {
        None   = 0,
        Bold   = 1 << 0,
        Italic = 1 << 1,
        Code   = 1 << 9 | PersistantWordBit,
        Link   = 1 << 10 | PersistantWordBit,
    }

    export function removeStyle(curr: number, remove: WordStyle): number {
        return curr & ~remove
    }

    export function removePaddingStyle(value: number): number {
        const mask = ~(0xFF << 8); // 0xFF = 0b11111111
        return value & mask;
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
        styles: number
        marked: boolean
        path: number[]
    }
}
