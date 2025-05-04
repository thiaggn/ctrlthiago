<script lang='ts'>
	import {page} from "$app/state";
	import type {Snippet} from "svelte";

	const p: {
		to: string
		label: string
		children: Snippet
		expanded: boolean
	} = $props()

	const pathName = $derived(page.url.pathname)
</script>

<a href={p.to} class:active={pathName.startsWith(p.to)} class:expanded={p.expanded}>
	<div class='icon'>
		{@render p.children()}
	</div>
	<div class='label'>{p.label}</div>
</a>

<style>
	a {
		overflow: hidden;
		display: flex;
		align-items: center;
		border-radius: 16px;
		text-decoration: none;
		color: inherit;

		&:not(.expanded)  {
			.icon {
				width: 44px;
			}

			.label {
				opacity: 0;
			}
		}

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10px 0;
			width: 54px;
			flex-shrink: 0;
			transition: width 300ms;
		}

		.label {
			transition: opacity 300ms;
			line-height: 1rem;
		}

		&.active {
			background: var(--color-prim-fog);
			color: var(--color-prim-bright);
			font-weight: 600;
		}

		&:not(.active):hover {
			background: var(--color-fog);
		}
	}
</style>