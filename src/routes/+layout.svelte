<script lang="ts">
	import '../theme/fonts.scss';
	import '../theme/theme.scss';
	import '../theme/main.scss';
	import '../theme/iframe.scss';
	import '../theme/variables.scss';
	import '../theme/hr.scss';
	import '../theme/blockquote.scss';
	import '../theme/scrollbar.scss';
	import '../theme/selection.scss';

	import { onMount } from 'svelte';
	import { initAnalytics } from '$lib/services/analytics.services.js';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';

	let { children } = $props();

	onMount(() => {
		initAnalytics();
	});

	let tag = $derived<'h1' | 'h3'>(page.route.id === '/blog/[slug]' ? 'h3' : 'h1');
</script>

<Header {tag} />

<main>
	{@render children?.()}
</main>

<Footer />
