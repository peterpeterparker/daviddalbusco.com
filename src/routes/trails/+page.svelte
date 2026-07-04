<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Trails from '$lib/components/Trails.svelte';
</script>

<svelte:head>
	<Seo />

	<style lang="scss">
		@use '../../theme/_page.scss';

		@include page.tertiary;
	</style>
</svelte:head>

<Trails />
