<script lang="ts">
	import Section from '$lib/components/section.svelte';
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

	<p>Hi there! 👋</p>

	<p>I'm a freelance web developer and contractor based in Zürich, Switzerland.</p>

	<p>
		I build performant, user-centric web applications. I develop both visually appealing apps and
		kick-ass architecture layers. Clients often hire me to create prototypes, products, or entire
		ecosystems from scratch.
	</p>

	<p>
		My frontend skills include <a
			href="https://svelte.dev/"
			rel="noopener noreferrer"
			target="_blank">Svelte</a
		>,
		<a href="https://angular.io" rel="noopener noreferrer" target="_blank">Angular</a>,
		<a href="https://reactjs.org" rel="noopener noreferrer" target="_blank">React</a>
		and
		<a href="https://stenciljs.com" rel="noopener noreferrer" target="_blank">StencilJS</a>, though
		I'm particularly passionate about framework-agnostic solutions using TypeScript.
	</p>

	<p>
		I prefer decentralized solutions over big tech cloud providers, which fuels my interest in
		blockchain networks — especially the <a
			href="https://internetcomputer.org/"
			rel="noopener noreferrer"
			target="_blank">Internet Computer</a
		>, on which I built
		<a href="https://juno.build" rel="noopener noreferrer" target="_blank">Juno</a>.
	</p>

	<p>
		While I don't handle backend work for clients, I have developed smart contracts in <a
			href="https://www.rust-lang.org"
			rel="noopener noreferrer"
			target="_blank">Rust</a
		> for my personal projects.
	</p>

	<p>
		I hold degrees in Computer Engineering and an Executive Master’s in Business Administration
		(EMBA), and I’m fluent in French, German, and English.
	</p>

	<p>When I'm not coding, you can find me running on mountain trails. 🏔️🏃</p>

	<p>
		If you have a project in mind or need some help, <a href="/#contact" rel="noopener noreferrer"
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
