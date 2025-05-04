<script>
	import {topbarState} from "$lib/topbar/state.svelte.js";
	import IconChevronRight from "$lib/icons/IconChevronRight.svelte";
</script>

<div class='topbar'>
	<div class='side'></div>
	<div class='center'>
		{#each topbarState.paths as path, i}
			<div class='path'>{path}</div>
			{#if (i + 1 != topbarState.paths.length)}
				<IconChevronRight/>
			{/if}
		{/each}
	</div>
	<div class='side'></div>
</div>

<style>
	.topbar {
		display: flex;
		height: 100%;
		justify-content: space-between;
		align-items: center;

		.side {
			max-width: 300px;
			width: 100%;
			height: 100%;
		}

		.center {
			display: flex;
			align-items: center;
			gap: 3px;
			font-size: 14px;
			font-weight: 600;
			color: var(--color-white-pure);
			display: flex;

			.path {
				line-height: 10px;
			}
		}
	}
</style>