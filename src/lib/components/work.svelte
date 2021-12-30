<script lang="ts">
  import Projects from '$lib/components/projects.svelte';
  import type {PortfolioMetadata} from '$lib/types/portfolio';
  import type {MarkdownData} from '$lib/types/markdown';

  export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Projects {projects}>
  <h2 id="portfolio">Work & Clients</h2>

  <p>
    I’ve worked with clients ranging from small startups, corporates, universities and foundations looking to develop
    stunning web products and mobile applications.
  </p>
</Projects>

<style lang="scss">
  p {
    margin: 0 0 3.25em;
  }
</style>
