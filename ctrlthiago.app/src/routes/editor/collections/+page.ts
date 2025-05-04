import type {PageLoad} from "../../../../.svelte-kit/types/src/routes/editor/collections/$types";
import {model} from "$lib/model";

export const load: PageLoad = async (ev) => {
    const res = await  ev.fetch(`${import.meta.env.VITE_API_URL}/api/v1/collections`)
    return {
        collections: await res.json() as model.CollectionHeader[]
    }
}