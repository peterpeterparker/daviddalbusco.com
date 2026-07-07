<script lang="ts">
	import Section from '$lib/core/components/Section.svelte';
	import Link from '$lib/core/components/Link.svelte';
	import { onMount } from 'svelte';
	import { track } from '$lib/core/services/analytics.services';

	// Do not prerender to prevent spam
	// See 2.6 - https://spencermortensen.com/articles/email-obfuscation/
	let loaded = $state(false);

	onMount(() => (loaded = true));

	const trackEvent = () => {
		track({ name: 'contact-hero' });
	};
</script>

<Section>
	<h2>Hi there! 👋</h2>

	<p>I'm a freelance engineer based in Zürich, Switzerland.</p>

	<p>I build software that lasts.</p>

	<p class="link">
		{#if loaded}
			<Link href="mailto:hi@daviddalbusco.com" onclick={trackEvent}>Hire me!</Link>
		{/if}
	</p>
</Section>

<style lang="scss">
	.link {
		min-height: 4rem;
	}
</style>
