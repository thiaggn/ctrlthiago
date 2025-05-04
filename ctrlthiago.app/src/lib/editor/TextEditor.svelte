<script lang="ts">
	import {model} from "$lib/model";
	import Title from "$lib/editor/entities/Title.svelte";
	import Paragraph from "$lib/editor/entities/Paragraph.svelte";
	import {textStore} from "$lib/editor/store.svelte";
	import {editorstate} from "$lib/editor/textstate.svelte";
</script>

<div class='text-editor' contenteditable="plaintext-only" use:editorstate={undefined}>
	{#each textStore.blocks as block (block.id)}
		{#if block.type === model.EntityType.Title}
			<Title title={block}/>
		{:else if block.type === model.EntityType.Paragraph}
			<Paragraph paragraph={block}/>
		{/if}
	{/each}
</div>

<style>
	.text-editor {
		/*hyphens: auto;*/
		/*overflow-wrap: break-word;*/
		/*word-wrap: break-word;*/
		/*text-align: justify;*/

		width: 100%;
		padding: 80px 120px;
		user-select: text;
		&:focus {
			outline: none;
		}

		&::selection {
			background-color: rgba(17, 80, 126, 0.44); /* cor de fundo da seleção */
		}
	}
</style>

