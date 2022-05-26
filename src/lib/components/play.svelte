<script lang="ts">
  import Projects from '$lib/components/projects.svelte';
  import type {MarkdownData} from '$lib/types/markdown';
  import type {PortfolioMetadata} from '$lib/types/portfolio';

  export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Projects {projects}>
  <h2>Play</h2>

  <p>A list of my open source projects I developed for fun and learning purpose.</p>
</Projects>

<style lang="scss">
  p {
    margin: 0 0 3.25em;
  }
</style>
