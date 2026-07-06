<script lang="ts">
	import type { TrailMetadata } from '$lib/types/trail';
	import { assetUrl } from '$lib/utils/assets.utils';
	import CardCover from '$lib/components/CardCover.svelte';
	import type { Attachment } from 'svelte/attachments';
	import IconClose from '$lib/icons/IconClose.svelte';
	import IconArrowForward from '$lib/icons/IconArrowForward.svelte';
	import IconArrowBack from '$lib/icons/IconArrowBack.svelte';

	interface Props {
		photos: TrailMetadata['photos'];
	}

	let { photos }: Props = $props();

	let images = $derived(photos.map((photo) => assetUrl(photo)));

	let selectedPhotoIndex = $state<number | undefined | null>(undefined);

	const selectPhotoIndex = (index: number) => {
		selectedPhotoIndex = index;
	};

	const resetPhoto = () => (selectedPhotoIndex = null);

    const showNextPhoto = () => {
        if (selectedPhotoIndex === undefined || selectedPhotoIndex === null) {
            return;
        }

        if (selectedPhotoIndex >= photos.length - 1) {
            return;
        }

        selectPhotoIndex(selectedPhotoIndex + 1)
    }

    const showPreviousPhoto = () => {
        if (selectedPhotoIndex === undefined || selectedPhotoIndex === null) {
            return;
        }

        if (selectedPhotoIndex <= 0) {
            return;
        }

        selectPhotoIndex(selectedPhotoIndex - 1)
    }

	const photoDialogAttachment: Attachment = (element) => {
		const handleToggle = ($event: Event) => {
			if ($event instanceof ToggleEvent && $event.newState === 'closed') {
				resetPhoto();
			}
		};

        const handleKeydown = ($event: Event) => {
            if ($event instanceof KeyboardEvent) {
                switch ($event.key) {
                    case 'ArrowRight':
                        $event.preventDefault();
                        showNextPhoto();
                        break;
                    case 'ArrowLeft':
                        $event.preventDefault();
                        showPreviousPhoto();
                        break;
                }
            }
        };

		element.addEventListener('toggle', handleToggle);
        document.addEventListener('keydown', handleKeydown);

		return () => {
			element.removeEventListener('toggle', handleToggle);
            document.removeEventListener('keydown', handleKeydown);
		};
	};
</script>

<ul>
	{#each images as image, i (i)}
		<li>
			<button class="btn-img" popovertarget="photo-dialog" onclick={() => selectPhotoIndex(i)}>
				<CardCover background="var(--color-light)" {image} cover={true} />
			</button>
		</li>
	{/each}
</ul>

<dialog id="photo-dialog" popover {@attach photoDialogAttachment}>
	{#if selectedPhotoIndex !== null && selectedPhotoIndex !== undefined}
		<img
			alt=""
			aria-hidden="true"
			loading="lazy"
			role="presentation"
			src={images[selectedPhotoIndex]}
		/>

		{#if selectedPhotoIndex < photos.length - 1}
			<button
				onclick={showNextPhoto}
				class="btn-dialog btn-next"
				aria-label="Next photo"><IconArrowForward /></button
			>
		{/if}

		{#if selectedPhotoIndex > 0}
			<button
				onclick={showPreviousPhoto}
				class="btn-dialog btn-previous"
				aria-label="Previous photo"><IconArrowBack /></button
			>
		{/if}
	{/if}

	<button
		class="btn-dialog btn-close"
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

	.btn-dialog {
		position: absolute;

		display: flex;
		justify-content: center;
		align-items: center;

		background: white;

		aspect-ratio: 1/1;

		transition: border 0.25s ease-out;

		border: 0.15rem solid black;

		:global(svg) {
			transition: transform 0.5s ease-out;
		}

		&:focus,
		&:hover {
			border: 0.15rem solid var(--color-highlight);

			:global(svg) {
				transform: scale(1.25);
			}
		}
	}

	.btn-close {
		top: 0.45rem;
		right: 0.45rem;
	}

	.btn-next {
		top: 50%;
		right: 0.45rem;
		transform: translate(0, -50%);
	}

	.btn-previous {
		top: 50%;
		left: 0.45rem;
		transform: translate(0, -50%);
	}

	img {
		display: flex;
		width: calc(100vw - 2rem);
		max-width: 1078px;
		aspect-ratio: 16/10;
	}

	dialog {
		padding: 0;

		&::backdrop {
			background: rgba(0, 0, 0, 0.8);
			backdrop-filter: blur(4px);
		}
	}
</style>
