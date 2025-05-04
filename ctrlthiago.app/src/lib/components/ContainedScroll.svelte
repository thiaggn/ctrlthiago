<script lang='ts'>
	const {centered}: { centered?: boolean } = $props()
</script>

<div class='relative'>
	<div class='absolute' class:centered>
		<slot/>
	</div>
</div>

<style>
	.relative {
		position: relative;
		height: 100%;
		width: 100%;

		.absolute {
			position: absolute;
			scrollbar-gutter: stable;
			height: 100%;
			width: 100%;
			overflow-y: auto;
			overflow-x: hidden;

			&.centered {
				display: flex;
				justify-content: center;
			}
		}
	}
</style>