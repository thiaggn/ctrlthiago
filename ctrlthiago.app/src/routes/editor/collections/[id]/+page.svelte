<script lang="ts">
	import {topbarState} from "$lib/topbar/state.svelte.js";
	import ViewWithMenu from "$lib/components/ViewWithMenu.svelte";
	import IconSearch from "$lib/icons/IconSearch.svelte";
	import IconArchive from "$lib/icons/IconArchive.svelte";
	import IconPencilPlus from "$lib/icons/IconPencilPlus.svelte";
	import IconArrowLeft from "$lib/icons/IconArrowLeft.svelte";
	import IconMessageLight from "$lib/icons/IconMessageLight.svelte";
	import IconChartLight from "$lib/icons/IconChartLight.svelte";
	import {model} from "$lib/model";
	import ButtonOcicat from "$lib/components/ButtonOcicat.svelte";
	import ContainedScroll from "$lib/components/ContainedScroll.svelte";

	const {data} = $props()

	topbarState.setPath("Coleções", data.collection.title)
	console.log(data)
</script>

<svelte:head>
	<title>{data.collection.title}</title>
</svelte:head>

<ContainedScroll>
	<ViewWithMenu>
		{#snippet menu()}
			<ButtonOcicat bright to='/editor/collections'>
				<IconArrowLeft/>
			</ButtonOcicat>
			<div class='option'>
				<IconPencilPlus/>
			</div>
			<div class='option'>
				<IconSearch/>
			</div>
			<div class='option'>
				<IconArchive/>
			</div>
		{/snippet}

		{#snippet view()}
			<div class='post-list'>
				{#each data.collection.posts as post (post.id)}
					<div class='item'>
						<div class='contents'>
							<div class='left'>
								<a class='title' href='/editor/posts/{post.id}'>{post.title}</a>
							</div>

							<div class='right'>
								<div class='number'>
									<IconMessageLight/>
									{post.comments}
								</div>
								<div class='number'>
									<IconChartLight/>
									{post.views}
								</div>
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

		&.return {
			color: var(--color-prim-fog);
			background: var(--color-prim-bright);
		}
	}

	.post-list {
		.section {
			margin-top: 10px;

			.header {
				.title {
					background: rgba(176, 196, 125, 0.08);
					padding: 2px 10px;
					border-radius: 2px;
					width: fit-content;
					font-weight: 600;
					color: var(--color-prim-bright);
					font-size: 12px;
				}
			}
		}

		.item {
			display: flex;
			align-items: center;
			padding: 10px;

			&:not(:last-of-type) {
				border-bottom: 1px solid var(--color-prim-fog);
			}

			.contents {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 24px;
				display: flex;

				.left, .right {
					display: flex;
					align-items: center;
					gap: 10px;
				}

				.title {
					cursor: pointer;
					text-decoration: none;
					color: inherit;

					&:hover {
						text-decoration: underline;
					}
				}

				.number {
					display: flex;
					align-items: center;
					gap: 2px;
				}
			}
		}
	}
</style>