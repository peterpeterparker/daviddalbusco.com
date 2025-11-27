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

	<p>I'm a freelance web developer based in Zürich, Switzerland.</p>

	<p>I build web apps that won't need a rewrite after a few months.</p>

	<p>
		{#if loaded}
			<Link href="mailto:hi@daviddalbusco.com">Hire me!</Link>
		{/if}
	</p>
</Section>
