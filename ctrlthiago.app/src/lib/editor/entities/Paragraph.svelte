<script lang="ts">
	import {model} from "$lib/model";
	import Word from "$lib/editor/entities/Word.svelte";

	interface Props {
		paragraph: model.Paragraph
	}

	const p: Props = $props()
</script>

<div class='paragraph'>
	{#each p.paragraph.words as word (word.id)}
		<Word word={word}/>
	{/each}
</div>

<style>
	.paragraph {

		&:empty {
			content: "Parágrafo vazio";
		}

		padding: 10px 0;
		font-size: 14px;
		line-height: 20px;
	}
</style>