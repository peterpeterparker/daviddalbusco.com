<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/core/components/Seo.svelte';
	import Blog from '$lib/blog/components/Blog.svelte';
	import Work from '$lib/portfolio/components/Work.svelte';
	import Play from '$lib/portfolio/components/Play.svelte';
	import About from '$lib/core/components/About.svelte';
	import Talks from '$lib/core/components/Talks.svelte';
	import Newsletter from '$lib/core/components/Newsletter.svelte';
	import { cleanBodyStyles } from '$lib/core/utils/styles.utils';
	import Hero from '$lib/core/components/Hero.svelte';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();

	let work = $derived(data.work);
	let play = $derived(data.play);
	let blog = $derived(data.blog);

	const onScroll = () => {
		const scrolledSize =
			window.pageYOffset ?? document.documentElement.scrollTop ?? document.body.scrollTop ?? 0;

		if (scrolledSize > 0) {
			return;
		}

		cleanBodyStyles();
	};
</script>

<svelte:head>
	<Seo />

	<style>
		body {
			color: var(--section-color, var(--color-highlight-contrast));
			background: var(--section-background, var(--color-highlight));
			--menu-color: var(--color-highlight-contrast);
			transition: background 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s;
		}
	</style>
</svelte:head>

<svelte:window onscroll={onScroll} />

<Hero />

<Work projects={work} />

<Play projects={play} />

<About />

<Talks />

<Newsletter />

<Blog more={true} posts={blog} />
