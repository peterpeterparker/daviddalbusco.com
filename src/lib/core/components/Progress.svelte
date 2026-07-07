<script lang="ts">
	interface Props {
		anchor: HTMLElement;
	}

	let { anchor }: Props = $props();

	let scrollY = $state(0);
	let value = $state(0);

	const onscroll = () => {
		const delta = document.documentElement.scrollHeight - anchor.offsetTop;
		const scrollLength = anchor.offsetTop - delta;

		const y = (scrollY * 100) / scrollLength;
		value = Math.min(100, Math.floor(y));
	};

	$effect(onscroll);
</script>

<svelte:window bind:scrollY />

<progress {value} max="100"></progress>

<style lang="scss">
	progress {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 0.25rem;

		z-index: 10;

		appearance: none;
		border: none;
	}

	// Color: https://stackoverflow.com/a/76860350/5404186
	progress {
		color: var(--color-highlight);
		background: transparent;

		/* Firefox: Filled portion of the progress bar */
		&::-moz-progress-bar {
			background: currentColor;
		}

		/* Chrome & Safari: Unfilled portion of the progress bar */
		&::-webkit-progress-bar {
			background: transparent;
		}

		/* Chrome & Safari: Filled portion of the progress bar */
		&::-webkit-progress-value {
			background: currentColor;
		}
	}
</style>
