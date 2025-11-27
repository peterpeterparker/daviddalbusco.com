<script lang="ts">
	import '../../theme/_grid.scss';
	import type { PageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import Blog from '$lib/components/Blog.svelte';
	import type { BlogMetadata } from '$lib/types/blog';
	import type { MarkdownData } from '$lib/types/markdown';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let posts: Omit<MarkdownData<BlogMetadata>, 'content'>[] = $derived(data.posts);
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Blog {posts} />
