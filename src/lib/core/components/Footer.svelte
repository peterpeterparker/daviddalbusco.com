<script lang="ts">
	import Contact from '$lib/core/components/Contact.svelte';
	import IconTwitter from '$lib/core/icons/IconTwitter.svelte';
	import IconLinkedIn from '$lib/core/icons/IconLinkedIn.svelte';
	import IconGitHub from '$lib/core/icons/IconGitHub.svelte';
	import IconBsky from '$lib/core/icons/IconBsky.svelte';
	import IconRss from '$lib/core/icons/IconRss.svelte';
	import { SITE_URL } from '$lib/core/constants';
</script>

<footer>
	<Contact />

	<div class="social">
		<div class="social-content">
			<a aria-label="Follow me on Bluesky" href="https://bsky.app/profile/daviddalbusco.com">
				<IconBsky height={26} />
			</a>
			<a aria-label="Follow me on X / Twitter" href="https://twitter.com/daviddalbusco/">
				<IconTwitter height={32} />
			</a>
			<a aria-label="Context me on Linkedin" href="https://www.linkedin.com/in/david-dal-busco/">
				<IconLinkedIn height={34} />
			</a>
			<a
				aria-label="Checkout my work on GitHub"
				href="https://github.com/peterpeterparker"
				class="github"
			>
				<IconGitHub size="32px" />
			</a>
			<a aria-label="Subscribe to my website RSS feed" href={`${SITE_URL}/rss.xml`} class="rss">
				<IconRss size="34px" />
			</a>
		</div>
	</div>
</footer>

<address aria-label="My company address">
	<strong>Fluster GmbH</strong>
	<span>Sihlquai 131</span>
	<span>8005 Zürich</span>
</address>

<style lang="scss">
	footer {
		margin: 1em 2.45em 1.45rem;

		@media screen and (max-width: 576px) {
			margin: 1em 1em 1.45rem;
		}

		@media screen and (min-width: 1078px) {
			margin: 2.45rem auto 1.45rem;
		}
	}

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
		gap: 0.75rem;
	}

	a {
		transition: transform 0.25s ease-out;

		&:last-of-type {
			margin-right: 0;
		}

		&:focus,
		&:hover {
			transform: translateY(-0.25rem);
		}
	}

	address {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.6rem;
		gap: 0.5rem;
		margin: 0 0 2.45rem;
	}

	.github {
		margin: 0 -0.1rem;
	}

	.rss {
		margin: 0 -0.25rem;
	}
</style>
