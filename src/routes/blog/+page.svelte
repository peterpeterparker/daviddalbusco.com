<script lang="ts">
	import '../../theme/_grid.scss';
	import type { PageData } from './$types';
	import Seo from '$lib/components/seo.svelte';
	import Blog from '$lib/components/blog.svelte';
	import type { BlogMetadata } from '$lib/types/blog';
	import type { MarkdownData } from '$lib/types/markdown';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let posts: MarkdownData<BlogMetadata>[] = $derived(data.posts);
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

<Blog {posts} />
