<script context="module">
  import {base} from '$app/paths';
  export const load = async ({fetch}) => {
    const portfolio = await fetch(`${base}/portfolio.json`).then((r) => r.json());

    const {work, play} = portfolio;

    return {
      props: {work, play}
    };
  };
</script>

<script lang="ts">
  import '../theme/_grid.scss';

  import Seo from '$lib/components/seo.svelte';
  import Work from '$lib/components/work.svelte';
  import Play from '$lib/components/play.svelte';
  import type {PortfolioMetadata} from '$lib/types/portfolio';
  import type {MarkdownData} from '$lib/types/markdown';

  export let work: MarkdownData<PortfolioMetadata>[];
  export let play: MarkdownData<PortfolioMetadata>[];
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

<Work projects={work} />

<Play projects={play} />
