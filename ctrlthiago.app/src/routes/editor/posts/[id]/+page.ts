import type {PageLoad, PageLoadEvent} from "../../../../../.svelte-kit/types/src/routes/editor/posts/[id]/$types";
import type {dto} from "$lib/dto";
export const ssr = false

export const load: PageLoad = async (ev: PageLoadEvent) => {
    const res = await ev.fetch(`${import.meta.env.VITE_API_URL}/api/v1/posts/${ev.params.id}`)
    const data = await res.json() as dto.Post
    return data
}