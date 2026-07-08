<script lang="ts">
	import Link from '$lib/core/components/Link.svelte';
	import Post from '$lib/blog/components/Post.svelte';
	import Section from '$lib/core/components/Section.svelte';
	import type { PageDataWithoutContent } from '$lib/core/types/page';
	import type { BlogMetadata } from '$lib/blog/types/blog';

	interface Props {
		posts: PageDataWithoutContent<BlogMetadata>[];
		more?: boolean;
	}

	let { posts, more = false }: Props = $props();
</script>

<Section background="var(--color-tertiary)" color="var(--color-tertiary-contrast)">
	<h2 id="blog">Blog</h2>

	<p>
		New skills I have learned and technologies I have used are part of my blog series, where I share
		the results of my recent work. That said, I’ve been blogging less lately as my focus is on
		building <a href="https://juno.build" rel="noopener noreferrer" target="_blank">Juno</a>.
	</p>

	<div class="grid">
		{#each posts as post (post.slug.name)}
			<Post {post} />
		{/each}
	</div>

	{#if more}
		<Link href="/blog">More articles...</Link>
	{/if}
</Section>

<style lang="scss">
	@use '../../../theme/_grid';

	.grid {
		margin: 0 0 2.25em;

		@include grid.panel;
	}

	p {
		margin: 0 0 3.25em;
	}
</style>
