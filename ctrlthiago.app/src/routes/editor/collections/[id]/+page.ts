// @ts-ignore
import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/editor/collections/$types";
import type {model} from "$lib/model";
import type {PageLoadEvent} from "../../../../../.svelte-kit/types/src/routes/editor/collections/[id]/$types";

export const load: PageLoad = async (ev: PageLoadEvent) => {
    const res = await ev.fetch(`${import.meta.env.VITE_API_URL}/api/v1/collections/${ev.params.id}`)
    return {
        collection: await res.json() as model.Collection
    }
}