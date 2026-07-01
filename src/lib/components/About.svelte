<script lang="ts">
	import Section from '$lib/components/Section.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2 id="about">
		About <img
			alt=""
			aria-hidden="true"
			loading="lazy"
			role="presentation"
			src="/images/david.webp"
		/>
	</h2>

	<p>
		I'm David, a freelance developer based in Zürich, available for project-based work and contract
		positions.
	</p>

	<p>
		My focus is building performant projects with careful attention to both interface quality and
		secure, scalable architectural foundations, from TypeScript frontends to Bun or Rust backends,
		you name it. Clients hire me to create prototypes, products, and complete ecosystems from
		scratch.
	</p>

	<p>
		Recent work includes large applications, developer tools, pipelines, and open-source platforms.
	</p>

	<p>
		Over the years I've also gathered startup experience launching products. I hold degrees in
		Computer Engineering and an EMBA. I'm fluent in French, German, and English.
	</p>

	<p>When I'm not coding, you can find me running on mountain trails. 🏔️🏃</p>

	<p>
		If you have a project in mind or need some help, <a href="#contact" rel="noopener noreferrer"
			>get in touch!</a
		>
	</p>
</Section>

<style lang="scss">
	img {
		border: 0.25rem solid black;
		width: 5rem;
		height: 5rem;
		margin-left: 1.45rem;

		@media screen and (max-width: 960px) {
			width: 3rem;
			height: 3rem;
		}
	}

	a {
		font-weight: bold;
	}
</style>
