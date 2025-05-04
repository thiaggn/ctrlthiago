<script>
	import IconFolderOpen from "$lib/icons/IconFolderOpen.svelte";
	import IconMessages from "$lib/icons/IconMessages.svelte";
	import IconChartBar from "$lib/icons/IconChartBar.svelte";
	import IconPalette from "$lib/icons/IconPalette.svelte";
	import IconFileText from "$lib/icons/IconFileText.svelte";
	import NavItem from "$lib/sidebar/NavItem.svelte";
	import IconSettings from "$lib/icons/IconSettings.svelte";
	import IconMenu from "$lib/icons/IconMenu.svelte";
	import Brand from "$lib/components/Brand.svelte";

	let expanded = $state(false)
</script>

<div class='sidebar' class:expanded>
	<div class='top'>
		<header>
			<div class='alternate' onclick={() => {expanded = !expanded}} role="none">
				<IconMenu/>
			</div>
			<div class='brand'>
				<Brand/>
			</div>
		</header>
		<nav>

			<NavItem expanded={expanded}
					 to='/editor/collections'
					 label='Coleções'><IconFolderOpen/></NavItem>

			<NavItem expanded={expanded}
					 to='/editor/pages'
					 label='Páginas'><IconFileText/></NavItem>

			<NavItem expanded={expanded}
					 to='/editor/comments'
					 label='Comentários'><IconMessages/></NavItem>

			<NavItem expanded={expanded}
					 to='/editor/charts'
					 label='Atividade'><IconChartBar/></NavItem>

			<NavItem expanded={expanded}
					 to='/editor/themes'
					 label='Temas'><IconPalette/></NavItem>

			<NavItem expanded={expanded}
					 to='/editor/settings'
					 label='Ajustes'><IconSettings/></NavItem>
		</nav>
		<div class='separator'></div>

	</div>
	<footer>
		<div class='rights'>© 2025 CShub - Criado por Thiago</div>
	</footer>
</div>

<style>
	.sidebar {
		flex-shrink: 0;
		width: 250px;
		border-right: var(--color-gray-fog) 1px solid;
		padding: 10px 10px 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: width 300ms;

		&:not(.expanded) {
			width: 64px;

			.brand {
				transform: translateX(30px);
			}

			.rights {
				opacity: 0;
			}
		}

		header {
			display: flex;
			align-items: center;
			gap: 10px;
			color: var(--color-white-pure);
			margin-bottom: 6px;

			.alternate {
				display: flex;
				padding: 10px;
				border-radius: 16px;

				&:hover {
					background: var(--color-fog);
				}
			}

			.brand {
				transition: 300ms;
			}

		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.separator {
			width: 100%;
			height: 1px;
			background: var(--color-gray-fog);
			margin: 20px 0;
		}

		footer {
			.rights {
				flex-shrink: 0;
				width: 100%;
				overflow: hidden;
				transition: opacity 300ms;
				white-space: nowrap;
				padding: 0 20px;
				font-size: 12px;
			}
		}
	}
</style>