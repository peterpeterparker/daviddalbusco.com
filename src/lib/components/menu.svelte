<script lang="ts">
	import { fly } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import IconOpen from '$lib/icons/IconOpen.svelte';

	interface Props {
		open: boolean;
	}

	let { open }: Props = $props();

	const dispatch = createEventDispatcher();

	const navigate = () => {
		dispatch('close');
	};
</script>

<div class:open class="menu">
	{#if open}
		<div class="container">
			<a href="/" data-sveltekit-reload onclick={navigate}
				><h2 in:fly={{ y: 100, duration: 500 }}>Home</h2></a
			>
			<a href="/#portfolio" onclick={navigate} rel="external"
				><h2 in:fly={{ y: 100, duration: 500 }}>Portfolio</h2></a
			>
			<a href="/#about" onclick={navigate} rel="external"
				><h2 in:fly={{ y: 100, duration: 500 }}>About</h2></a
			>
			<a href="/blog" onclick={navigate}><h2 in:fly={{ y: 100, duration: 500 }}>Blog</h2></a>
			<a
				href="http://eepurl.com/giun5j"
				target="_blank"
				onclick={navigate}
				rel="external noopener noreferrer"
				><h2 in:fly={{ y: 100, duration: 500 }}>Newsletter<IconOpen size="2.5rem" /></h2></a
			>
			<a href="/#contact" onclick={navigate} rel="external"
				><h2 in:fly={{ y: 100, duration: 500 }}>Contact</h2></a
			>
		</div>
	{/if}
</div>

<style lang="scss">
	.menu {
		pointer-events: none;
		visibility: hidden;
		opacity: 0;

		transition: opacity 0.15s ease-in;

		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		background: white;

		z-index: 2;

		color: black;

		&.open {
			pointer-events: all;
			visibility: visible;
			opacity: 1;
		}

		padding: 5.45rem 2.45em;

		@media screen and (max-width: 576px) {
			a :global(svg) {
				display: none;
			}
		}
	}

	a {
		text-decoration: none;
	}

	.container {
		max-width: 1240px;
		margin: 0 auto;
	}
</style>
