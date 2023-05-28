<script lang="ts">
  import Projects from '$lib/components/projects.svelte';
  import type {PortfolioMetadata} from '$lib/types/portfolio';
  import type {MarkdownData} from '$lib/types/markdown';

  export let projects: MarkdownData<PortfolioMetadata>[];
</script>

<Projects {projects}>
  <h2 id="portfolio">Work & Clients</h2>

  <p>
    Throughout my career, I've had the pleasure of collaborating with a diverse range of clients. From small startups
    and corporates to universities and foundations, I've had the opportunity to assist them in creating exceptional web
    products and mobile applications.
  </p>
</Projects>

<style lang="scss">
  p {
    margin: 0 0 3.25em;
  }
</style>
