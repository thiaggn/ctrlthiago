<script lang="ts">
	import {model} from "$lib/model";
	import {textstate} from "$lib/editor/textstate.svelte";

	const p: {
		word: model.Word
	} = $props()

	function is(style: string): boolean {
		if (!Object.hasOwn(p.word, 'styles')) {
			return false
		}

		return p.word.styles.includes(style as model.WordStyle)
	}
</script>

<div class='word'
	 class:bold={is('b')}
	 class:code={is('c')}
	 class:italic={is('i')}
	 use:textstate={{path: $state.snapshot(p.word.path)}}
>
	{p.word.text}
</div>

<style>
	.word {
		display: inline;

		&.bold {
			font-weight: 600;
		}

		&.italic {
			font-style: italic;
		}

		&.code {
			border-radius: 2px;
			border: 1px solid var(--color-gray-fog-l1);
			padding: 2px 4px;
			font-family: 'Consolas', monospace;
			font-size: 0.857142857em;
		}
	}
</style>