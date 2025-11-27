<script lang="ts">
	import Contact from '$lib/components/Contact.svelte';
	import IconTwitter from '$lib/icons/IconTwitter.svelte';
	import IconLinkedIn from '$lib/icons/IconLinkedIn.svelte';
	import IconGitHub from '$lib/icons/IconGitHub.svelte';
	import IconBsky from '$lib/icons/IconBsky.svelte';
</script>

<footer>
	<Contact />

	<div class="social">
		<div class="social-content">
			<a aria-label="Follow me on Bluesky" href="https://bsky.app/profile/daviddalbusco.com">
				<IconBsky height={26} />
			</a>
			<a aria-label="Follow me on X / Twitter" href="https://twitter.com/daviddalbusco/">
				<IconTwitter size="24px" />
			</a>
			<a aria-label="Context me on Linkedin" href="https://www.linkedin.com/in/david-dal-busco/">
				<IconLinkedIn size="30px" />
			</a>
			<a aria-label="Checkout my work on GitHub" href="https://github.com/peterpeterparker">
				<IconGitHub size="32px" />
			</a>
		</div>
	</div>
</footer>

<style lang="scss">
	.social {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		margin: 3.75rem 0 0;

		@media screen and (max-width: 960px) {
			display: block;
		}
	}

	.social-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	a {
		margin: 0 0.15rem;

		transition: transform 0.25s ease-out;

		svg {
			transition: transform 0.5s ease-out;
		}

		&:last-of-type {
			margin-right: 0;
		}

		&:focus,
		&:hover {
			transform: translateY(-0.25rem);

			svg {
				transform: scale(1.25);
			}
		}
	}
</style>
