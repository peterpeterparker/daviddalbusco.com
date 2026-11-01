<script lang="ts">
	import Section from '#lib/core/components/Section.svelte';
	import ContactBtn from '#lib/core/components/ContactBtn.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2 id="services">Services</h2>

	<p>
		Companies usually hire me to <strong>build</strong> new products, prototypes, libraries, often from
		scratch, or to contribute to their large codebase. I've also been asked to create developer tools,
		CLIs, and pipelines.
	</p>

	<p>
		Another growing part of my work, guess what, is <strong>reviewing</strong> vibe coded projects. For
		example, say you built an internal tool that pulls in different sources of data, with a dashboard
		and reporting on top. It works great, but at some point you start facing deployment issues, performance
		problems, or simply wonder whether the authentication your LLM agent built follows best practices.
		That's where I come in, to dig into it and get it closer to production-ready.
	</p>

	<p>
		Lastly, my most niche service is probably <strong>consulting</strong>. It can be strictly
		technical (architecture, tooling, tests, CI, infrastructure, etc.), organizational (business
		analysis, project management), or even more "metaphysical" like shipping and marketing 😉.
	</p>
</Section>

<style lang="scss">
	@use '../../../theme/_heading';

	strong {
		@include heading.title;

		font-size: var(--font-size-h3-small);
		line-height: 0;
	}
</style>
