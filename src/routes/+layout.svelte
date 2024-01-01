<script>
	import '../theme/fonts.scss';
	import '../theme/theme.scss';
	import '../theme/main.scss';
	import '../theme/iframe.scss';
	import '../theme/variables.scss';

	import Nav from '$lib/components/nav.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<Nav />

<slot />

<Footer />
