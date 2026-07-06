<script lang="ts">
	interface Props {
		background: string;
		image: string;
		cover?: boolean;
	}

	let { background, image, cover = false }: Props = $props();
</script>

<span style="background: {background}">
	<img alt="" aria-hidden="true" class:cover loading="lazy" role="presentation" src={image} />
</span>

<style lang="scss">
	img {
		transition: transform 0.5s ease-out;
	}

	span {
		transition: border 0.25s ease-out;

		&:focus,
		&:hover {
			border: 0.45rem solid var(--color-highlight);

			img:not(.cover) {
				transform: scale(1.25);
			}
		}
	}

	span {
		position: relative;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: var(--cover-img-height, 15rem);

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
