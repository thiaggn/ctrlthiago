<script>
	import SideBar from "$lib/sidebar/SideBar.svelte";
	import TopBar from "$lib/topbar/TopBar.svelte";
</script>

<div class='editor'>
	<SideBar/>
	<div class='view-area'>
		<div class='topbar-area'>
			<TopBar/>
		</div>
		<slot/>
	</div>
</div>

<style>
	:root {
		--color-black: #0d100d;
		--color-prim-fog: #1b2318;
		--color-gray-fog: #262826;
		--color-gray-fog-l0: #262826;
		--color-gray-fog-l1: #383b38;
		--color-gray-fog-l2: #565b56;
		--color-gray-fog-l3: #6c726c;
		--color-gray-fog-l4: #8b9a8b;
		--color-prim-bright: #95bc74;
		--color-prim-bright-1: #78a949;
		--color-white: #afb2ac;
		--color-white-d1: #9aa297;
		--color-white-pure: #e0e0e0;

		--color-fog: rgba(255, 255, 255, 0.05);
	}

	:root {
		font-family: 'Segoe UI', sans-serif;
		font-size: 14px;
		color-scheme: dark;
		color: var(--color-white);
		scrollbar-width: thin;
		scrollbar-color: #2e3329 var(--color-black);
	}

	.editor {
		display: flex;
		min-height: 100vh;
		background: var(--color-black);
		width: 100%;
		user-select: none;

		.view-area {
			display: flex;
			width: 100%;
			flex-direction: column;

			.topbar-area {
				flex-shrink: 0;
				width: 100%;
				height: 60px;
				margin-bottom: 10px;
			}
		}
	}

</style>