<script>
import IconTerminal from "$lib/icons/IconTerminal.svelte";
</script>

<div class='brand'>
	<div class='icon'><IconTerminal/></div>
	<div class='text'>cshub</div>
</div>

<style>
	.brand {
		height: 24px;
		display: flex;
		align-items: center;
		gap: 5px;

		.icon {
			display: flex;
		}

		.text {
			font-family: 'Erode', 'Segoe UI', sans-serif;
			font-weight: 600;
			font-size: 24px;
			line-height: 10px;
		}
	}
</style>