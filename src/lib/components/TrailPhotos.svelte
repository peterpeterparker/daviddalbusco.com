<script lang="ts">
	import type { TrailMetadata } from '$lib/types/trail';
	import { assetUrl } from '$lib/utils/assets.utils';
	import CardCover from '$lib/components/CardCover.svelte';
	import type { Attachment } from 'svelte/attachments';
	import IconClose from '$lib/icons/IconClose.svelte';

	interface Props {
		photos: TrailMetadata['photos'];
	}

	let { photos }: Props = $props();

    let selectedPhoto = $state<string | undefined | null>(undefined);

	const selectPhoto = (photo: string) => {
		selectedPhoto = photo;
	};

	const resetPhoto = () => (selectedPhoto = null);

	const photoDialogAttachment: Attachment = (element) => {
		const handleToggle = (event: Event) => {
			if (event instanceof ToggleEvent && event.newState === 'closed') {
				resetPhoto();
			}
		};

		element.addEventListener('toggle', handleToggle);

		return () => {
			element.removeEventListener('toggle', handleToggle);
		};
	};
</script>

<ul>
	{#each photos as photo, i (i)}
		{@const image = assetUrl(photo)}

		<li>
			<button class="btn-img" popovertarget="photo-dialog" onclick={() => selectPhoto(image)}>
				<CardCover background="var(--color-light)" {image} cover={true} />
			</button>
		</li>
	{/each}
</ul>

<dialog id="photo-dialog" popover {@attach photoDialogAttachment}>
	{#if selectedPhoto !== null || selectedPhoto !== undefined}
		<img alt="" aria-hidden="true" loading="lazy" role="presentation" src={selectedPhoto} />
	{/if}

	<button
		class="btn-close"
		popovertarget="photo-dialog"
		popovertargetaction="hide"
		aria-label="Close photo"><IconClose /></button
	>
</dialog>

<style lang="scss">
	ul {
		display: flex;
		gap: 0.75rem;

		overflow-x: auto;

		margin: 0;
		padding: 0.45rem 0 0;
	}

	li {
		min-width: 300px;
		--cover-img-height: 100%;
		list-style: none;
	}

	.btn-img {
		display: block;
		height: 100%;
		padding: 0;
	}

	.btn-close {
		display: block;

		position: absolute;
		top: 0;
		right: 0;
	}

	img {
		max-height: calc(100vh - 8rem);
	}

	dialog {
		display: inline-flex;
		padding: 0;

		&::backdrop {
			background: rgba(0, 0, 0, 0.8);
			backdrop-filter: blur(4px);
		}
	}
</style>
