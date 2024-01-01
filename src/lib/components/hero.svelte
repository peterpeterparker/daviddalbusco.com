<script>
	import Section from '$lib/components/section.svelte';
</script>

<header><h3>David Dal Busco</h3></header>

<Section>
	<h1>Freelance Web Developer</h1>
</Section>

<style lang="scss">
	h1 {
		font-size: calc(var(--font-size-h1) * 2.5);
		line-height: calc(var(--line-height-h1) * 1.75);
		text-shadow: 0.05em 0.05em var(--section-background, var(--color-primary));
		margin: 0.75em 0 1.25em;
		transition: color 0.15s ease-in;

		@media screen and (max-width: 960px) {
			font-size: calc(var(--font-size-h1) * 1.5);
			line-height: calc(var(--line-height-h1));
		}

		@media screen and (max-width: 576px) {
			font-size: calc(var(--font-size-h1));
			line-height: calc(var(--line-height-h1) * 0.7);
		}
	}

	header {
		@media screen and (max-width: 390px) {
			padding-top: 3.45rem;
		}
	}

	h1,
	h3 {
		color: var(--section-color, var(--color-highlight-contrast));
	}
</style>
