<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		path: string;
		slug: string;
		background: string;
		image: string;
		cover?: boolean;
		children?: import('svelte').Snippet;
	}

	let { path, slug, background, image, cover = false, children }: Props = $props();
</script>

<a href={`${base}/${path}/${slug}`}>
	<article>
		<div style="background: {background}">
			<img alt="" aria-hidden="true" class:cover loading="lazy" role="presentation" src={image} />
		</div>

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

		img {
			transition: transform 0.5s ease-out;
		}

		div {
			transition: border 0.25s ease-out;
		}

		&:focus,
		&:hover {
			transform: translateY(-1.5rem);

			img:not(:global(.cover)) {
				transform: scale(1.25);
			}

			div {
				border: 0.75rem solid var(--color-highlight);
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

	div {
		position: relative;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 15rem;

		border: 0.75rem solid black;

		margin-bottom: 1em;

		img:not(:global(.cover)) {
			width: 8rem;
			height: 8rem;
		}

		img.cover {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}
	}
</style>
