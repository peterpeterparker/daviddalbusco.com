<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let formData = $state({
		name: '',
		email: '',
		msg: ''
	});

	const onsubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		console.log(formData);
	};
</script>

<form aria-labelledby="contact-heading" {onsubmit}>
	<h3 id="contact-heading" class="hidden">Contact Form</h3>

	<fieldset class="form">
		<legend class="hidden">contact form</legend>
		<div>
			<label for="contact-name">Name</label>
			<input
				bind:value={formData.name}
				required
				type="text"
				id="contact-name"
				name="name"
				autocomplete="off"
				placeholder="Hello..."
				maxlength="100"
			/>
		</div>

		<div>
			<label for="contact-email">Email Address</label>
			<input
				bind:value={formData.email}
				required
				type="email"
				id="contact-email"
				name="email"
				autocomplete="off"
				placeholder="Where can I reply?"
				maxlength="200"
			/>
		</div>

		<div class="enquiry">
			<label for="contact-enquiry">What's in your mind?</label>
			<textarea
				bind:value={formData.msg}
				required
				id="contact-enquiry"
				name="enquiry"
				rows="5"
				maxlength="10000"
				placeholder="Tell me about your project or enquiry..."></textarea>
		</div>

		<input
			type="text"
			name="datafield"
			id="datafield"
			autocomplete="off"
			tabindex="-1"
			aria-hidden="true"
			class="hidden"
		/>

		<Button type="submit">Send message</Button>
	</fieldset>
</form>

<style lang="scss">
	.hidden {
		display: none;
	}

	.form {
		display: grid;
		grid-template-columns: 1fr;
		grid-column-gap: 1.75rem;
		grid-row-gap: 1.75rem;

		border: none;
		padding: 2.45rem 0;

		@media screen and (min-width: 576px) {
			grid-template-columns: 1fr 1fr;
		}
	}

	div {
		display: flex;
		flex-direction: column;
	}

	.enquiry {
		@media screen and (min-width: 576px) {
			grid-column: 1/3;
		}
	}

	textarea {
		resize: none;
	}

	input,
	textarea {
		margin: 0.25rem 0;
		padding: 0.45rem;
		box-shadow: 3px 3px black;
		border: 1px solid black;

		transition:
			color 0.25s ease-out,
			background 0.25s ease-out,
			transform 0.15s ease-out,
			box-shadow 0.15s ease-out;

		&:focus {
			outline: none;

			box-shadow: 3px 3px var(--color-highlight);
			border: 1px solid var(--color-highlight);
		}
	}
</style>
