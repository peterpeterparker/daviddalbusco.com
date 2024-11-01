<script lang="ts">
	interface Props {
		action?: (() => void) | undefined;
		type?: 'submit' | 'button';
		children?: import('svelte').Snippet;
	}

	let { action = undefined, type = 'button', children }: Props = $props();

	const onClick = () => {
		if (!action) {
			return;
		}

		action();
	};
</script>

<button onclick={onClick} {type}>
	{@render children?.()}
</button>

<style lang="scss">
	button {
		margin: 0.45rem 0;
		padding: 0.45rem;
		background: var(--color-primary);
		color: var(--color-primary-contrast);
		box-shadow: 3px 3px black;
		border: 1px solid black;

		width: fit-content;

		transition:
			color 0.25s ease-out,
			background 0.25s ease-out,
			transform 0.15s ease-out,
			box-shadow 0.15s ease-out;

		&:hover {
			background: var(--color-highlight);
			color: var(--color-highlight-contrast);
		}

		&:active {
			box-shadow: none;
			transform: translateX(3px) translateY(3px);
		}
	}
</style>
