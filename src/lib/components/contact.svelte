<script lang="ts">
	import Section from '$lib/components/section.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2 id="contact">Get in touch</h2>

	<p>Want to collaborate or just say hi?</p>

	<p>Drop me an email at <span class="email"><b>hi</b>@<b>mail.</b>daviddalbusco.com</span></p>
</Section>

<style lang="scss">
	p {
		margin: 0 0.45rem 0 0;
	}

	.email {
		text-decoration: underline;

		b {
			font-weight: normal;

			&:nth-child(2) {
				display: none;
			}
		}
	}
</style>
