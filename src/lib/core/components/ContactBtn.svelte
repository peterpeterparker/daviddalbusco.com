<script lang="ts">
	import Link from '$lib/core/components/Link.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { track } from '$lib/core/services/analytics.services';

	interface Props {
		eventName: 'contact-hero' | 'contact-about';
		children: Snippet;
	}

	let { eventName, children }: Props = $props();

	// Do not prerender to prevent spam
	// See 2.6 - https://spencermortensen.com/articles/email-obfuscation/
	let loaded = $state(false);

	onMount(() => (loaded = true));

	const trackEvent = () => {
		track({ name: eventName });
	};
</script>

{#if loaded}
	<Link href="mailto:hi@daviddalbusco.com" onclick={trackEvent}>{@render children()}</Link>
{/if}
