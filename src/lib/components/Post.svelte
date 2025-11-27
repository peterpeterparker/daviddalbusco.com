<script lang="ts">
	import type { MarkdownData } from '$lib/types/markdown';
	import type { BlogMetadata } from '$lib/types/blog';
	import Card from '$lib/components/Card.svelte';

	interface Props {
		post: MarkdownData<BlogMetadata>;
	}

	let { post }: Props = $props();

	let metadata = $derived(post.metadata);
	let slug = $derived(post.slug);

	let title = $derived(metadata.title);
	let description = $derived(metadata.description);
	let image = $derived(metadata.image);
	let postDate = $derived(metadata.date);
</script>

<Card background="transparent" cover={true} {image} path="blog" {slug}>
	<h3>{title}</h3>
	<p>{description}</p>

	<p class="date">
		{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
			new Date(postDate)
		)}
	</p>
</Card>

<style lang="scss">
	.date {
		font-size: 0.8rem;
		margin: 0;
	}
</style>
