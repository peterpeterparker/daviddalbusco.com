<script context="module">
  import {base} from '$app/paths';
  export const load = async ({fetch}) => {
    const posts = await fetch(`${base}/blog.json`).then((r) => r.json());
    return {
      props: {posts}
    };
  };
</script>

<script lang="ts">
  import '../theme/_grid.scss';

  import Seo from '$lib/components/seo.svelte';
  import Blog from '$lib/components/blog.svelte';
  import type {BlogMetadata} from '$lib/types/blog';
  import type {MarkdownData} from '$lib/types/markdown';

  export let posts: MarkdownData<BlogMetadata>[];
</script>

<svelte:head>
  <Seo />

  <style>
    body {
      --menu-color: black;
    }
  </style>
</svelte:head>

<Blog {posts} />
