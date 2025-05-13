<script lang="ts">
	import type {Snippet} from "svelte";

	interface Props {
		to?: string
		children: Snippet
		bright?: boolean
		light?: boolean
		vibrant?: boolean
		onClick?: () => void
	}

	const {to, children, bright, light, vibrant, onClick}: Props = $props()

	const tag = to ? 'a' : 'div'
</script>

<svelte:element this={tag} class='button' class:bright class:light class:vibrant href={to} onclick={onClick} role='none'>
	{@render children()}
</svelte:element>

<style>
	.button {
		background: var(--color-prim-fog);
		display: flex;
		border-radius: 16px;
		justify-content: center;
		align-items: center;
		width: 40px;
		height: 40px;
		color: var(--color-prim-bright);

		&.light {
			cursor: pointer;
			color: var(--color-white-d1);
			background: transparent;

			&:hover {
				color: var(--color-white-pure);
			}
		}

		&.bright {
			color: var(--color-prim-fog);
			background: var(--color-prim-bright);
		}

		&.vibrant {
			color: var(--color-prim-bright-1);

			&:hover {
				color: var(--color-prim-bright);
			}
		}
	}
</style>