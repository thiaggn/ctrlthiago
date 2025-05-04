<script>
	import {topbarState} from "$lib/topbar/state.svelte.js";
	import IconFolderPlus from "$lib/icons/IconFolderPlus.svelte";
	import IconSearch from "$lib/icons/IconSearch.svelte";
	import IconArchive from "$lib/icons/IconArchive.svelte";
	import {model} from "$lib/model.js";
	import ViewWithMenu from "$lib/components/ViewWithMenu.svelte";
	import ContainedScroll from "$lib/components/ContainedScroll.svelte";

	let {data} = $props()
	topbarState.setPath("Coleções")

</script>

<svelte:head>
	<title>Coleções</title>
</svelte:head>

<ContainedScroll>
	<ViewWithMenu>
		{#snippet menu()}
			<div class='option'>
				<IconFolderPlus/>
			</div>
			<div class='option'>
				<IconSearch/>
			</div>
			<div class='option'>
				<IconArchive/>
			</div>
		{/snippet}

		{#snippet view()}
			<div class='collection-list'>
				{#each data.collections as collection (collection.id)}
					<div class='item'>
						<div class='header'>
							<a class='title' href='/editor/collections/{collection.id}'>{collection.title}</a>
							<div class='visibility'>{model.visibilityToText(collection.visibility)}</div>
						</div>

						<div class='info'>
							<div class='activity'>
								<div class='item'>{collection.views} views</div>
								<span>•</span>
								<div class='item'>{collection.comments} comentários</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/snippet}
	</ViewWithMenu>
</ContainedScroll>


<style>
	.option {
		background: var(--color-prim-fog);
		display: flex;
		border-radius: 16px;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		color: var(--color-prim-bright);
	}

	.collection-list {
		height: 100%;
		width: 100%;
		display: grid;
		grid-auto-rows: 90px;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		grid-gap: 10px;

		> .item {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 16px;
			border: 1px solid var(--color-gray-fog);
			border-radius: 4px;

			.header {
				display: flex;
				justify-content: space-between;
				gap: 20px;

				.title {
					font-weight: 600;
					text-decoration: none;
					color: inherit;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;

					&:hover {
						text-decoration: underline;
					}
				}

				.visibility {
					flex-shrink: 0;
					height: fit-content;
					font-size: 12px;
					border: 1px solid var(--color-gray-fog-l0);
					padding: 0 8px;
					border-radius: 20px;
					color: var(--color-gray-fog-l3);
				}
			}

			.info {
				display: flex;

				.activity {
					display: flex;
					gap: 5px;
					font-size: 12px;
					color: var(--color-gray-fog-l3);
				}
			}
		}
	}
</style>