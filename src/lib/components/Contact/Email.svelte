<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/services/analytics.services';
	import Email from '$lib/components/Email.svelte';

	// Do not prerender to prevent spam
	// See 2.6 - https://spencermortensen.com/articles/email-obfuscation/
	let loaded = $state(false);

	onMount(() => (loaded = true));

	const trackEvent = () => {
		track({ name: 'contact-email' });
	};
</script>

<p class="link">
	Need my help? Drop me an email at {#if loaded}<a
			href="mailto:hi@daviddalbusco.com"
			onclick={trackEvent}><Email /></a
		>{:else}<Email />{/if}.
</p>
