<script lang="ts">
  import type {PageData} from './$types';
  import Seo from '$lib/components/seo.svelte';
  import Button from '$lib/components/button.svelte';
  import {goto} from '$app/navigation';
  import type {MarkdownData} from '$lib/types/markdown';
  import type {PortfolioMetadata} from '$lib/types/portfolio';

  export let data: PageData;

  let portfolio: MarkdownData<PortfolioMetadata>;
  $: ({portfolio} = data);

  let content: string;
  $: ({content} = portfolio);

  const navigatePortfolio = () => goto('/portfolio');
</script>

<svelte:head>
  <Seo />

  <style>
    body > div:first-child {
      --menu-color: black;
      --section-color: black;
    }
  </style>
</svelte:head>

<main>
  {@html content}

  <Button action={navigatePortfolio}>Continue to portfolio</Button>
</main>

<style lang="scss">
  main {
    max-width: 1140px;
    margin: 5.45rem auto;
    padding: 0 2.45rem;

    :global(img) {
      padding: 0;
    }

    :global(h2) {
      margin-top: 3.45rem;
    }

    :global(button:last-of-type) {
      margin-top: 2.45rem;
    }
  }
</style>
