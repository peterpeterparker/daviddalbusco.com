<script lang="ts">
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo.svelte';
	import Button from '$lib/components/button.svelte';
	import { goto } from '$app/navigation';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { PortfolioMetadata } from '$lib/types/portfolio';

	export let data: PageData;

	let portfolio: MarkdownData<PortfolioMetadata>;
	$: ({ portfolio } = data);

	let content: string;
	$: ({ content } = portfolio);

	const navigatePortfolio = () => goto('/portfolio');
</script>

<svelte:head>
	<Seo />

	<style>
		body > div:first-child {
			--menu-color: black;
			--section-color: black;
		}
	</style>
</svelte:head>

<main>
	{@html content}
</main>

<div class="action"><Button action={navigatePortfolio}>Continue to portfolio</Button></div>

<style lang="scss">
	main, .action {
		max-width: 1240px;
		margin: 0 auto 2.45rem;
	}

	main {
		border: 0.25rem solid black;
		padding: 2.45rem 1.45rem;

		:global(img) {
			padding: 0;
		}

		:global(h2) {
			margin-top: 3.45rem;
		}

		:global(button:last-of-type) {
			margin-top: 2.45rem;
		}
	}
</style>
