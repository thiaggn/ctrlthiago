<script lang="ts">
	import {topbarState} from "$lib/topbar/state.svelte.js";
	import ContainedScroll from "$lib/components/ContainedScroll.svelte";
	import ToolBar from "$lib/editor/ToolBar.svelte";
	import ButtonOcicat from "$lib/components/ButtonOcicat.svelte";
	import IconArrowLeft from "$lib/icons/IconArrowLeft.svelte";
	import TextEditor from "$lib/editor/TextEditor.svelte";
	import {model} from "$lib/model";
	import {editor} from "$lib/editor/store.svelte";
	import type {dto} from "$lib/dto";
	import {transform} from "$lib/transform.svelte";

	const p = $props()

	const col = p.data
			.relatedCollections
			.find((c: model.Collection) => c.id === p.data.post.collectionId)

	if (col) {
		topbarState.setPath("Cadernos", col.title, p.data.post.title)
	}

	editor.setBlocks(p.data.blocks.map((b: dto.Block) => transform(b)))
</script>

<svelte:head>
	<title>{p.data.post.title}</title>
</svelte:head>

<div class='page'>
	<div class='false'>
		<ContainedScroll centered>
			<div class='wrapper'>
				<div class='toolbar'></div>
				<div class='body'></div>
			</div>
		</ContainedScroll>
	</div>
	<ContainedScroll centered>
		<div class='wrapper'>
			<div class='toolbar'>
				<ButtonOcicat to='/editor/collections/{p.data.post.collectionId}'>
					<IconArrowLeft/>
				</ButtonOcicat>
				<ToolBar/>
			</div>
			<div class='body'>
				<TextEditor/>
			</div>
		</div>
	</ContainedScroll>
</div>

<style>
	.page {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;

		.wrapper {
			padding: 0 20px;
			max-width: 900px;
			width: 100%;
			height: 100%;

			.toolbar {
				display: flex;
				position: fixed;
				flex-direction: column;
				gap: 8px;
				width: 40px;
			}

			.body {
				height: 100%;
				margin-left: 60px;
			}
		}

		.false {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			.wrapper .body {
				border: 1px solid var(--color-gray-fog);
				border-bottom: none;
				border-radius: 4px;
				box-shadow: rgba(0, 0, 0, 0.47) 0 0 50px;
			}
		}
	}
</style>