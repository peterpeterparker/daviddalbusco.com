<script>
	import Section from '$lib/components/section.svelte';
	import Button from '$lib/components/button.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
	<h2 id="contact">Contact</h2>

	<p>Get in touch through this form and let's work together!</p>

	<form action="https://formspree.io/david@fluster.io" method="POST">
		<input aria-label="Your name" name="name" placeholder="Your name" type="text" />
		<input aria-label="Your email" name="_replyto" placeholder="Your email" type="email" />
		<input aria-label="Your phone" name="phone" placeholder="Your phone" type="tel" />
		<textarea aria-label="Your message" name="message" placeholder="Your message" rows="4"
		></textarea>

		<input name="_gotcha" style="display: none" type="text" />
		<input name="_next" type="hidden" value="https://daviddalbusco.com" />

		<Button type="submit">Send</Button>
	</form>
</Section>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
	}

	input,
	textarea {
		border: 0.25rem solid black;

		margin: 0.45rem 0;
		padding: 0.25rem 0.45rem;

		outline: none;

		transition: border 0.15s ease-out;

		&:focus {
			border: 0.25rem solid var(--color-highlight);
		}

		&::placeholder {
			color: var(--color-highlight);
			opacity: 1;
		}
	}

	textarea {
		resize: none;
	}
</style>
