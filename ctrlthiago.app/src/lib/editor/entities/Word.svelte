<script lang="ts">
	import {model} from "$lib/model";
	import {source} from "$lib/editor/listeners";

	const p: {
		word: model.Word
	} = $props()

	const bold = $derived((p.word.styles & model.WordStyle.Bold) != 0)
	const code = $derived((p.word.styles & model.WordStyle.Code) != 0)
	const italic = $derived((p.word.styles & model.WordStyle.Italic) != 0)
</script>

<div class='word' class:bold class:code class:italic>
	<span use:source={{path: $state.snapshot(p.word.path)}}>
		{p.word.text}
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