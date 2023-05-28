<script lang="ts">
  import Projects from '$lib/components/projects.svelte';
  import type {MarkdownData} from '$lib/types/markdown';
  import type {PortfolioMetadata} from '$lib/types/portfolio';

  export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Projects {projects}>
  <h2>Play</h2>

  <p>
    As an open source enthusiast, I have actively engaged in developing various projects for both fun and learning
    purposes. Here are some notable products I have developed:
  </p>
</Projects>

<style lang="scss">
  p {
    margin: 0 0 3.25em;
  }
</style>
