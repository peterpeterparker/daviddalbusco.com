<script lang="ts">
	import { base } from '$app/paths';
	import CardCover from '$lib/core/components/CardCover.svelte';
	import type { Slug } from '$lib/core/types/slug';
	import { toSlugPath } from '$lib/core/utils/slug.utils';
	import type { Snippet } from 'svelte';

	interface Props {
		path: string;
		slug: Slug;
		background?: string;
		image?: string;
		cover?: boolean;
		children?: Snippet;
	}

	let { path, slug, background, image, cover = false, children }: Props = $props();
</script>

<a href={`${base}/${path}/${toSlugPath(slug)}`}>
	<article>
		{#if background !== undefined && image !== undefined}
			<CardCover {background} {image} {cover} />
		{/if}

		{@render children?.()}
	</article>
</a>

<style lang="scss">
	a {
		color: inherit;
		text-decoration: inherit;

		&:hover,
		&:active {
			color: inherit;
			text-decoration: inherit;
		}

		transition: transform 0.25s ease-out;

		@media (hover: hover) and (pointer: fine) {
			&:focus,
			&:hover {
				transform: translateY(-1rem);
			}
		}
	}

	article {
		width: 100%;
		height: 100%;

		position: relative;

		&:focus-visible {
			outline: none;
		}
	}
</style>
