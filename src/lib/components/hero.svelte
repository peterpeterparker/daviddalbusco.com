<script>
	import Section from '$lib/components/section.svelte';
</script>

<Section>
	<h1>
		Freelance Web Developer <svg
			xmlns="http://www.w3.org/2000/svg"
			width="80px"
			viewBox="0 0 640 512"
			><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
				d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3 .8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2 .6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7 .8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
			/></svg
		>
	</h1>

	<p>
		I build performant user-centric web applications. Clients often hire me to develop prototypes,
		products, or even entire ecosystems from scratch.
	</p>
</Section>

<style lang="scss">
	h1 {
		font-size: calc(var(--font-size-h1) * 1.45);
		line-height: calc(var(--line-height-h1) * 1.25);
		letter-spacing: -0.1em;
		margin: 0 0 2.45rem;
		transition: color 0.15s ease-in;
		max-width: 640px;

		@media screen and (max-width: 960px) {
			font-size: calc(var(--font-size-h1) * 1.5);
			line-height: calc(var(--line-height-h1));
		}

		@media screen and (max-width: 576px) {
			font-size: calc(var(--font-size-h1));
			line-height: calc(var(--line-height-h1) * 0.7);
		}
	}

	p {
		margin: 0;
	}
</style>
