<script>
	import '../theme/fonts.scss';
	import '../theme/theme.scss';
	import '../theme/main.scss';
	import '../theme/iframe.scss';
	import '../theme/variables.scss';
	import '../theme/hr.scss';

	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<Header />

<slot />

<Footer />
