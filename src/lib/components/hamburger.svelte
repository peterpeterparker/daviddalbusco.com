<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let open = false;

	const dispatch = createEventDispatcher();

	const onClick = () => {
		open = !open;

		dispatch('state', open);
	};

	export const close = () => {
		open = false;

		dispatch('state', open);
	};
</script>

<button aria-label="Menu" on:click={onClick}>
	<div class="first" class:open />
	<div class="second" class:open />
	<div class="third" class:open />
</button>

<style lang="scss">
	button {
		width: 3em;
		height: 3em;

		z-index: 3;

		display: flex;
		flex-direction: column;

		position: relative;

		padding: 0.25rem 0;

		transition: transform 0.2s ease 0s;
	}

	div {
		margin: 0.15rem;
		display: block;

		width: 2em;
		height: 4px;
		background: transparent;
		transition: transform 0.2s ease 0s;

		position: relative;

		&:before {
			content: '';
			display: block;

			width: 2em;
			height: 4px;

			position: absolute;
			left: 0;
			top: 0;

			border-radius: 1px;

			background: black;
			transition:
				width 0.2s ease 0s,
				background 0.2s ease 0s;

			@media screen and (max-width: 576px) {
				background: white;
			}
		}

		&.open:before {
			background: black;
		}
	}

	.first {
		&:before {
			width: 1.7em;
		}

		&.open {
			transform: rotate(45deg) translate(0em, -0.25em);

			&:before {
				width: 1em;
			}
		}

		transform-origin: top left;
	}

	.second {
		&.open {
			transform: rotate(-45deg) translate(0, 0.075em);
			width: 2.5em;

			&:before {
				width: 2.25em;
			}
		}
	}

	.third {
		&.open {
			transform: rotate(45deg) translate(1.1em, 0.55em);

			&:before {
				width: 1em;
			}
		}

		transform-origin: bottom right;
	}
</style>
