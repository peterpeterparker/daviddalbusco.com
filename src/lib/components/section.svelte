<script lang="ts">
  import {onMount} from 'svelte';
  import {/* @vite-ignore */ isMobile} from '@deckdeckgo/utils';

  let section: HTMLElement;

  export let color: string;
  export let background: string;

  onMount(() => {
    const observer: IntersectionObserver = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry: IntersectionObserverEntry = entries.find(
          ({isIntersecting}: IntersectionObserverEntry) => isIntersecting
        );

        if (!entry) {
          return;
        }

        const applyStyle = ({prop, value}: {prop: string; value: string | undefined}) => {
          if (value) {
            document.body.style.setProperty(prop, value);
          } else {
            document.body.style.removeProperty(prop);
          }
        };

        applyStyle({prop: '--section-color', value: color});
        applyStyle({prop: '--section-background', value: background});
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
  <slot />
</section>

<style lang="scss">
  section {
    position: relative;
  }
</style>
