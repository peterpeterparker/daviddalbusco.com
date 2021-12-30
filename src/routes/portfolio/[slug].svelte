<script context="module">
  import {base} from '$app/paths';

  export const load = async ({page, fetch}) => {
    const {params} = page;
    const {slug} = params;

    const post = await fetch(`${base}/portfolio/${slug}.json`).then((r) => r.json());
    return {
      props: {...post}
    };
  };
</script>

<script lang="ts">
  import Seo from '$lib/components/seo.svelte';
  import Button from '$lib/components/button.svelte';
  import {goto} from '$app/navigation';

  export let content: string;

  const navigatePortfolio = () => goto('/portfolio');
</script>

<svelte:head>
  <Seo />

  <style>
    body {
      --menu-color: black;
    }
  </style>
</svelte:head>

<main>
  {@html content}

  <Button action={navigatePortfolio}>More projects</Button>
</main>

<style lang="scss">
  main {
    max-width: 1140px;
    margin: 5.45rem auto;
    padding: 0 2.45rem;

    :global(img) {
      padding: 3.75rem;
    }

    :global(h2) {
      margin-top: 3.45rem;
    }

    :global(button:last-of-type) {
      margin-top: 1.45rem;
    }
  }
</style>
