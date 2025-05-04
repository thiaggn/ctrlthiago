<script lang="ts">
	import type {Snippet} from "svelte";

	const p: {
		menu: Snippet
		view: Snippet
	} = $props()

</script>

<div class='page'>
	<div class='wrapper'>
		<div class='context-menu'>
			{@render p.menu()}
		</div>
		<div class='view'>
			{@render p.view()}
		</div>
	</div>
</div>

<style>
	.page {
		--max-width: 900px;
		display: flex;
		justify-content: center;
		width: 100%;
		height: 100%;
		position: sticky;

		.wrapper {
			padding: 0 20px;
			max-width: var(--max-width);
			width: 100%;
			height: 100%;

			.context-menu {
				display: flex;
				position: fixed;
				flex-direction: column;
				gap: 8px;
				width: 40px;
			}

			.view {
				height: 100%;
				margin-left: 60px;
			}
		}
	}
</style>