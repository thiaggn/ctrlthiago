<script lang="ts">
	import {model} from "$lib/model";
	import Word from "$lib/editor/entities/Word.svelte";

	interface Props {
		title: model.Title
	}

	const p: Props = $props()

	function mapSize(input: number): number {
		if (input == 1) return 28;
		if (input == 2) return 24;
		if (input == 3) return 20;
		return 0
	}
</script>

<div class='title' style="font-size: {mapSize(p.title.size)}px">
	{#each p.title.words as word (word.id)}
		<Word word={word}/>
	{/each}
</div>

<style>
	.title {
		font-weight: 500;
		padding-bottom: 10px;
		font-family:  'Archivo Narrow','Arial Narrow', serif;

		&:not(:first-child) {
			padding-top: 24px;
		}
	}
</style>