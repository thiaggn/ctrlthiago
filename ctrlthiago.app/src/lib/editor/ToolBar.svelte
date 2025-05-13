<script>
	import ButtonOcicat from "$lib/components/ButtonOcicat.svelte";
	import IconTextSize from "$lib/icons/IconTextSize.svelte";
	import IconCode from "$lib/icons/IconCode.svelte";
	import IconTable from "$lib/icons/IconTable.svelte";
	import IconQuote from "$lib/icons/IconQuote.svelte";
	import IconBoxAlignRight from "$lib/icons/IconBoxAlignRight.svelte";
	import IconLink from "$lib/icons/IconLink.svelte";
	import IconLock from "$lib/icons/IconLock.svelte";
	import {editor} from "$lib/editor/store.svelte.js";
</script>

<div class='toolbar'>
	<ButtonOcicat light>
		<IconTextSize/>
	</ButtonOcicat>

	<ButtonOcicat light>
		<IconCode/>
	</ButtonOcicat>

	<ButtonOcicat light>
		<IconLink/>
	</ButtonOcicat>

	<ButtonOcicat light>
		<IconTable/>
	</ButtonOcicat>

	<ButtonOcicat light>
		<IconQuote/>
	</ButtonOcicat>

	<ButtonOcicat light>
		<IconBoxAlignRight/>
	</ButtonOcicat>

	<ButtonOcicat light vibrant={editor.onSafeMode} onClick={() => editor.toggleSafeMode()}>
		<IconLock/>
	</ButtonOcicat>
</div>

<style>
	.toolbar {

	}
</style>