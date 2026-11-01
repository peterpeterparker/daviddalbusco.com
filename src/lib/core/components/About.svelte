<script lang="ts">
	import Section from '#lib/core/components/Section.svelte';
	import ContactBtn from '#lib/core/components/ContactBtn.svelte';
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
		I'm David, a freelance engineer based in Zürich, available for project-based work and contract
		positions.
	</p>

	<p>
		When I'm not working, you can find me running <a href="/trails">trails</a> or cycling. 🏔️🏃🚴
	</p>

	<p>Have a project in mind or need some help? Get in touch!</p>

	<ContactBtn eventName="contact-about">Say hello 👋</ContactBtn>
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
