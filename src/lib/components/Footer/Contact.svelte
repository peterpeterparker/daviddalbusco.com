<script lang="ts">
	import { track } from '$lib/services/analytics.services';

	const trackEvent = () => {
		track({ name: 'contact-footer' });
	};
</script>

<h2 id="contact">Get in touch</h2>

<p>Want to collaborate or just say hi? <a href="/contact" onclick={trackEvent}>Reach out</a>!</p>

<style lang="scss">
	p {
		margin: 0 0.45rem 0 0;
	}
</style>
