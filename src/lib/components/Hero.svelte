<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Link from '$lib/components/Link.svelte';
	import { track } from '$lib/services/analytics.services';

	const trackEvent = () => {
		track({ name: 'contact-hero' });
	};
</script>

<Section>
	<h2 id="about">Hi there! 👋</h2>

	<p>I'm a freelance web engineer based in Zürich, Switzerland.</p>

	<p>I build applications that last.</p>

	<p><Link href="/contact" onclick={trackEvent}>Hire me!</Link></p>
</Section>
