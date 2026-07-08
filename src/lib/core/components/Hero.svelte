<script lang="ts">
	import Section from '$lib/core/components/Section.svelte';
	import ContactBtn from '$lib/core/components/ContactBtn.svelte';
</script>

<Section>
	<h2>Hi there! 👋</h2>

	<p>I'm a freelance engineer based in Zürich, Switzerland.</p>

	<p>I build software that lasts.</p>

	<p class="link">
		<ContactBtn eventName="contact-hero">Hire me!</ContactBtn>
	</p>
</Section>

<style lang="scss">
	.link {
		min-height: 4rem;
	}
</style>
