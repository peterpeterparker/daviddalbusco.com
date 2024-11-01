<script lang="ts">
	import { onMount } from 'svelte';
	import { /* @vite-ignore */ isMobile } from '@deckdeckgo/utils';

	let section: HTMLElement = $state();

	interface Props {
		color?: string | undefined;
		background?: string | undefined;
		children?: import('svelte').Snippet;
	}

	let { color = undefined, background = undefined, children }: Props = $props();

	onMount(() => {
		const observer: IntersectionObserver = new IntersectionObserver(
			(entries: IntersectionObserverEntry[]) => {
				const entry = entries.find(
					({ isIntersecting }: IntersectionObserverEntry) => isIntersecting
				);

				if (!entry) {
					return;
				}

				const applyStyle = ({ prop, value }: { prop: string; value: string | undefined }) => {
					if (value) {
						document.body.style.setProperty(prop, value);
					} else {
						document.body.style.removeProperty(prop);
					}
				};

				applyStyle({ prop: '--section-color', value: color });
				applyStyle({ prop: '--section-background', value: background });
			},
			{
				threshold: isMobile() ? 0.15 : 0.25
			}
		);

		observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section bind:this={section}>
	{@render children?.()}
</section>

<style lang="scss">
	section {
		@media screen and (min-width: 1240px) {
			margin: 2.45rem auto;
		}
	}
</style>
