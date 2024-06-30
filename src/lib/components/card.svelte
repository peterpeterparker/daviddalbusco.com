<script lang="ts">
	import { base } from '$app/paths';

	export let path: string;
	export let slug: string;

	export let background: string;
	export let image: string;

	export let cover: boolean = false;
</script>

<a href={`${base}/${path}/${slug}`}>
	<article>
		<div style="background: {background}">
			<img alt="" aria-hidden="true" class:cover loading="lazy" role="presentation" src={image} />
		</div>

		<slot />
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

			img:not(.cover) {
				transform: scale(1.2);
			}

			div {
				border: 0.75rem solid #ff74b2;
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
		border-radius: 1px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 15rem;

		border: 0.75rem solid black;

		margin-bottom: 1em;

		img:not(.cover) {
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
