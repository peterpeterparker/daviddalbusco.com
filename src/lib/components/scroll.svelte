<script lang="ts">
  import {onMount} from 'svelte';
  import {fade} from 'svelte/transition';
  import {isMobile} from '@deckdeckgo/utils';

  let visible: boolean = false;
  let observer: IntersectionObserver;

  const disconnect = () => observer?.disconnect();

  const onClick = () => {
    const portfolio = document.querySelector('#portfolio');
    portfolio.scrollIntoView({behavior: 'smooth'});

    visible = false;
    disconnect();
  };

  onMount(() => {
    observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry: IntersectionObserverEntry = entries.find(
          ({isIntersecting}: IntersectionObserverEntry) => isIntersecting
        );

        if (!entry) {
          visible = true;
          return;
        }

        visible = false;
        disconnect();
      },
      {
        threshold: isMobile() ? 0.15 : 0.25
      }
    );

    const portfolio = document.querySelector('#portfolio');

    observer.observe(portfolio);
    return () => disconnect();
  });
</script>

{#if visible}
  <button on:click={onClick} aria-label="Scroll down" transition:fade>
    <div class="first" />
    <div class="second" />
  </button>
{/if}

<style lang="scss">
  button {
    width: 3em;
    height: 3em;

    position: absolute;

    bottom: -4rem;
    right: 0;

    animation: zoom 1s infinite alternate;
  }

  div {
    margin: 0.15rem;
    display: block;

    width: 1.5em;
    height: 4px;
    background: transparent;

    position: absolute;
    left: 20%;
    top: 65%;

    &:before {
      content: '';
      display: block;

      width: 1.5em;
      height: 4px;

      position: absolute;
      left: 0;
      top: 0;

      border-radius: 1px;

      background: var(--section-color, var(--menu-color));
    }
  }

  .first {
    transform: rotate(45deg) translate(-0.75em, -0.125em);
  }

  .second {
    transform: rotate(-45deg) translate(0.75em, -0.125em);
  }

  /* -global- */
  @keyframes -global-zoom {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.5);
    }
  }
</style>
