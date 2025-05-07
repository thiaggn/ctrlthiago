<script lang="ts">
	import {model} from "$lib/model";
	import Title from "$lib/editor/entities/Title.svelte";
	import Paragraph from "$lib/editor/entities/Paragraph.svelte";
	import {textStore} from "$lib/editor/store.svelte";
</script>

<div class='text-editor' contenteditable="plaintext-only">
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
		text-align: justify;
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

