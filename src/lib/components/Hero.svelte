<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import Link from '$lib/components/Link.svelte';
	import { onMount } from 'svelte';

	// Do not prerender to prevent spam
	// See 2.6 - https://spencermortensen.com/articles/email-obfuscation/
	let loaded = $state(false);

	onMount(() => (loaded = true));
</script>

<Section>
	<h2 id="about">Hi there! 👋</h2>

	<p>I'm a freelance web engineer based in Zürich, Switzerland.</p>

	<p>I build applications that last.</p>

	<p class="link">
		{#if loaded}
			<Link href="mailto:hi@daviddalbusco.com">Hire me!</Link>
		{/if}
	</p>
</Section>

<style lang="scss">
	.link {
		min-height: 4rem;
	}
</style>
