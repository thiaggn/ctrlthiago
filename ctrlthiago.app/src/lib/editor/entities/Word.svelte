<script lang="ts">
	import {model} from "$lib/model";
	import {stateBinder} from "$lib/editor/binder.svelte";
	import {selectionListener} from "$lib/editor/selection";

	const p: {
		word: model.Word
	} = $props()

	function is(style: string): boolean {
		return p.word.styles.includes(style as model.WordStyle)
	}

	const text = $derived(p.word.styles.length == 0)
	const bindState = stateBinder.getBinder()
	const bindSelection = selectionListener.getBinder()
</script>

<div class='word' use:bindSelection={{path: $state.snapshot(p.word.path)}}
	 class:text class:marked={p.word.marked} class:bold={is('b')} class:code={is('c')} class:italic={is('i')}>
	<span use:bindState="{{path: $state.snapshot(p.word.path)}}">
		{p.word.marked ? '\u200a' : p.word.text}
	</span>
</div>

<style lang="scss">

	.word {
		display: inline;
		position: relative;
		hyphens: auto;
		overflow-wrap: break-word;
		word-wrap: break-word;
		border-radius: 2px;

		&.bold {
			font-weight: 600;
		}

		&.italic {
			font-style: italic;
		}

		&.code {
			margin-left: 1px;
			white-space: pre;
			border: 1px solid var(--color-gray-fog-l1);
			font-family: 'Consolas', monospace;
			font-size: 0.857142857em;
			padding: 2px 4px;
			color: var(--color-gray-fog-l4);
		}
	}
</style>