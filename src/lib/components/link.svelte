<script lang="ts">
	import IconOpen from '$lib/icons/IconOpen.svelte';

	interface Props {
		href: string;
		external?: boolean;
		children?: import('svelte').Snippet;
	}

	let { href, external = false, children }: Props = $props();
</script>

<a
	{href}
	target={external ? '_blank' : undefined}
	rel={external ? 'external noopener noreferrer' : undefined}
>
	{@render children?.()}
	{#if external}<IconOpen />{/if}
</a>

<style lang="scss">
	a {
		margin: 0.45rem 0;
		padding: 0.45rem;
		background: var(--color-primary);
		color: var(--color-primary-contrast);
		box-shadow: 3px 3px black;
		border: 1px solid black;

		transition:
			color 0.25s ease-out,
			background 0.25s ease-out,
			transform 0.15s ease-out,
			box-shadow 0.15s ease-out;

		display: inline-flex;
		justify-content: center;
		align-items: center;
		gap: 0.45rem;

		text-decoration: none;

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
