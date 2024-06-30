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

	<p>Hi there! It's great to meet you! 👋</p>

	<p>I'm a freelance web developer and contractor based in Zürich, Switzerland.</p>

	<p>
		I build performant, user-centric web applications. I develop both visually appealing apps and
		kick-ass architecture layers. Clients often hire me to create prototypes, products, or even
		entire ecosystems from scratch.
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
		<a href="https://stenciljs.com" rel="noopener noreferrer" target="_blank">StencilJS</a>, but I'm
		passionate about framework-agnostic agnostic solutions using TypeScript.
	</p>

	<p>
		I prefer decentralized solutions over using big tech cloud providers, which is why I have a keen
		interest in blockchain networks, particularly the <a
			href="https://internetcomputer.org/"
			rel="noopener noreferrer"
			target="_blank">Internet Computer</a
		>.
	</p>

	<p>
		While I don't handle any backend work for clients, I have developed a few smart contracts using <a
			href="https://www.rust-lang.org"
			rel="noopener noreferrer"
			target="_blank">Rust</a
		> for my personal projects.
	</p>

	<p>
		In addition to my technical skills, I have experience in project management, business
		requirements analysis, and UX design from a developer's perspective. I hold degrees in Computer
		Engineering and an Executive Master's in Business Administration. I'm fluent in French, German,
		and English.
	</p>

	<p>
		I've launched several open-source personal projects that failed, but I gained valuable
		experience in how to launch a tech-focused project and build communities without spending money
		on advertisement.
	</p>

	<p>
		When I'm not busy coding, you can often find me running on mountain trails for a few hours on
		the weekend. 🏔️🏃
	</p>

	<p>
		If you need help or have a project in mind, feel free to <a
			href="/#contact"
			rel="noopener noreferrer">get in touch!</a
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
