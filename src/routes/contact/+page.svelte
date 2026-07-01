<script lang="ts">
	import Contact from '$lib/components/Contact/Contact.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Contact />
