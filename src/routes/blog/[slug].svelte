<script context="module">
  import {base} from '$app/paths';

  export const load = async ({params, fetch}) => {
    const {slug} = params;

    const post = await fetch(`${base}/blog/${slug}.json`).then((r) => r.json());
    return {
      props: {...post}
    };
  };
</script>

<script lang="ts">
  import {browser} from '$app/env';
  import {onMount} from 'svelte';

  import '../../theme/_blog.scss';

  import Button from '$lib/components/button.svelte';
  import Seo from '$lib/components/seo.svelte';
  import type {BlogMetadata} from '$lib/types/blog';
  import { goto } from "$app/navigation"

  export let slug: string;
  export let content: string;
  export let metadata: BlogMetadata;

  export let {title, canonical, description, image, date: postDate, tags} = metadata;

  onMount(async () => {
    if (!browser) {
      return;
    }

    const {defineCustomElement} = await import(/* @vite-ignore */ '@deckdeckgo/highlight-code/dist/components/deckgo-highlight-code');
    defineCustomElement();
  });

  const navigateBlog = () => goto('/blog');
</script>

<svelte:head>
  <Seo {canonical} {description} {image} {title} url={`/blog/${slug}`} />

  <style>
    body {
      --menu-color: black;
      --section-color: black;
    }
  </style>
</svelte:head>

<main>
  <h1>{title}</h1>
  <h3>{description}</h3>

  <p class="date">
    {new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric'}).format(new Date(postDate))}
  </p>
  <p>{tags}</p>

  <article>
    {@html content}
  </article>

  <Button action={navigateBlog}>Continue to blog</Button>
</main>

<style lang="scss">
  .date {
    margin: 0;
  }

  h3 {
    font-weight: 400;
    margin-bottom: 1.45rem;
  }

  main {
    max-width: 1140px;
    margin: 5.45rem auto;
    padding: 0 2.45rem;
  }

  :global(button:last-of-type) {
    margin-top: 2.45rem;
  }
</style>
