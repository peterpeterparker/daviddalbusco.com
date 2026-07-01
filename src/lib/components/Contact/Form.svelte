<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { sendMessage, type FormData } from '$lib/services/contact.services';
	import { fade } from 'svelte/transition';

	const DEFAULT_FORM_DATA: FormData = {
		name: '',
		email: '',
		msg: ''
	};

	let formData = $state(DEFAULT_FORM_DATA);

	let sendResult = $state<'ok' | 'error' | undefined>(undefined);

	const onsubmit = async ($event: SubmitEvent) => {
		$event.preventDefault();

		const result = await sendMessage({ data: $state.snapshot(formData) });

		if (result.status === 'error') {
			console.error(result.err);
			sendResult = 'error';
			return;
		}

		sendResult = 'ok';
		formData = DEFAULT_FORM_DATA;
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

{#if sendResult !== undefined}
	<p in:fade class="result" class:error={sendResult === 'error'}>
		{#if sendResult === 'error'}
			Hmm, something went wrong. Mind trying again or just emailing me?
		{:else}
			Got it, thanks! I'll get back to you soon. 👍
		{/if}
	</p>
{/if}

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
		padding: 2.45rem 0 0.45rem;

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

	.result {
		font-weight: bolder;
	}

	.error {
		color: var(--color-highlight);
	}
</style>
