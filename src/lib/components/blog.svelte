<script lang="ts">
	import '../../theme/_grid.scss';

	import Link from '$lib/components/link.svelte';
	import Post from '$lib/components/post.svelte';
	import Section from '$lib/components/section.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { BlogMetadata } from '$lib/types/blog';

	interface Props {
		posts: MarkdownData<BlogMetadata>[];
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
		{#each posts as post (post.slug)}
			<Post {post} />
		{/each}
	</div>

	{#if more}
		<Link href="/blog">More articles...</Link>
	{/if}
</Section>

<style lang="scss">
	.grid {
		margin: 0 0 2.25em;
	}

	p {
		margin: 0 0 3.25em;
	}
</style>
