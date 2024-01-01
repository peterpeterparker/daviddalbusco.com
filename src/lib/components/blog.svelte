<script lang="ts">
	import { goto } from '$app/navigation';

	import '../../theme/_section.scss';
	import '../../theme/_grid.scss';

	import Link from '$lib/components/link.svelte';
	import Post from '$lib/components/post.svelte';
	import Section from '$lib/components/section.svelte';
	import type { MarkdownData } from '$lib/types/markdown';
	import type { BlogMetadata } from '$lib/types/blog';

	export let posts: MarkdownData<BlogMetadata>[];
	export let more = false;
</script>

<Section background="var(--color-tertiary)" color="var(--color-tertiary-contrast)">
	<h2 id="blog">Blog</h2>

	<p>
		New skills I have learned, technologies I have used, and tutorials I have followed. In my series
		of blog posts, I share the outcomes of my recent hobby work.
	</p>

	<div class="grid">
		{#each posts as post}
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
