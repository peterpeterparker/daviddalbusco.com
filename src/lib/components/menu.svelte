<script lang="ts">
  import {fly} from 'svelte/transition';
  import {createEventDispatcher} from 'svelte';

  export let open: boolean;

  const dispatch = createEventDispatcher();

  const navigate = () => {
    dispatch('close');
  };
</script>

<div class:open>
  {#if open}
    <a href="/" sveltekit:reload on:click={navigate}><h2 in:fly={{y: 100, duration: 500}}>Home</h2></a>
    <a href="/#portfolio" sveltekit:reload on:click={navigate} rel="external"><h2 in:fly={{y: 100, duration: 500}}>Portfolio</h2></a>
    <a href="/#about" sveltekit:reload on:click={navigate} rel="external"><h2 in:fly={{y: 100, duration: 500}}>About</h2></a>
    <a href="/blog" sveltekit:reload on:click={navigate}><h2 in:fly={{y: 100, duration: 500}}>Blog</h2></a>
    <a href="/#contact" sveltekit:reload on:click={navigate} rel="external"><h2 in:fly={{y: 100, duration: 500}}>Contact</h2></a>
  {/if}
</div>

<style lang="scss">
  div {
    pointer-events: none;
    visibility: hidden;
    opacity: 0;

    transition: opacity 0.15s ease-in;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    background: white;

    z-index: 2;

    color: black;

    &.open {
      pointer-events: all;
      visibility: visible;
      opacity: 1;
    }

    padding: 5.45rem 2.45em;
  }
</style>
