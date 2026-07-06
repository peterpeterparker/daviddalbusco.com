<script lang="ts">
	import type { PageData as ServerPageData } from './$types';
	import Seo from '$lib/components/Seo.svelte';
	import Blog from '$lib/components/Blog.svelte';
	import type { BlogMetadata } from '$lib/types/blog';
	import type { PageDataWithoutContent } from '$lib/types/page';

	interface Props {
		data: ServerPageData;
	}

	let { data }: Props = $props();
	let posts = $derived<PageDataWithoutContent<BlogMetadata>[]>(data.posts);
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Blog {posts} />
