<script lang="ts">
	import IconArrowForward from '$lib/core/icons/IconArrowForward.svelte';

	interface BreadcrumbRoute {
		title: string;
		path: string;
	}

	interface Props {
		route: BreadcrumbRoute;
		group?: BreadcrumbRoute;
		page?: { title: string };
	}

	let { route, page, group }: Props = $props();
</script>

<nav aria-label="Navigation breadcrumb">
	<ul>
		<li><a href="/">Home</a><IconArrowForward size="12px" /></li>
		<li>
			{#if page !== undefined || group !== undefined}<a href={route.path}>{route.title}</a
				><IconArrowForward size="12px" />{:else}{route.title}{/if}
		</li>
		{#if group !== undefined}
			<li>
				{#if page !== undefined}<a href={`${route.path}/${group.path}`}>{group.title}</a
					><IconArrowForward size="12px" />{:else}{group.title}{/if}
			</li>
		{/if}
		{#if page !== undefined}<li><span class="title">{page.title}</span></li>{/if}
	</ul>
</nav>

<style lang="scss">
	@use '../../../theme/_text';

	nav {
		font-style: italic;
	}

	ul {
		display: inline-table;
		margin: 0 0 0 1.45rem;
	}

	li {
		display: inline;

		margin: 0 0.5rem 0 0;

		list-style: none;

		a + :global(svg) {
			margin-left: 0.5rem;
		}

		:global(svg) {
			vertical-align: middle;
		}
	}

	.title {
		@media screen and (min-width: 576px) {
			display: inline-block;
			vertical-align: bottom;

			@include text.truncate;

			max-width: 470px;
		}
	}
</style>
