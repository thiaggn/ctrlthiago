import type {PageLoad, PageLoadEvent} from "../../../../../.svelte-kit/types/src/routes/editor/posts/[id]/$types";
import type {dto} from "$lib/dto";
import {textStore} from "$lib/editor/store.svelte";
import {transform} from "$lib/transform";

export const ssr = false

export const load: PageLoad = async (ev: PageLoadEvent) => {
    const res = await ev.fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${ev.params.id}`)
    const data = await res.json() as dto.Post

    textStore.setBlocks(data.blocks.map((b: dto.Block) => transform(b)))

    return data
}