<script lang="ts">
  import Section from '$lib/components/section.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
  <h2 id="about">
    About <img alt="" aria-hidden="true" loading="lazy" role="presentation" src="/icons/icon-256x256.png" />
  </h2>

  <p>Hi, nice to meet you 👋.</p>
  <p>I'm a freelance web developer and contractor, open source enthusiast, based in Zürich, Switzerland.</p>

  <p>
    I am experienced with
    <mark> <a href="https://svelte.dev/" rel="noopener noreferrer">Svelte</a></mark>,
    <mark> <a href="https://angular.io" rel="noopener noreferrer">Angular</a></mark>,
    <mark>
      <a href="https://reactjs.org" rel="noopener noreferrer">React</a>
    </mark>
    and
    <mark>
      <a href="https://stenciljs.com" rel="noopener noreferrer">StencilJS</a>
    </mark>
    but my true love is developing agnostic libraries and components with vanilla JavaScript / TypeScript.
  </p>
  <p>
    In my humble opinion, decentralization and reclaiming the ownership on our data is the way to go. That's why I am
    interested by the concept of blockchain networks and a fan of the <mark>
      <a href="https://internetcomputer.org/" rel="noopener noreferrer">Internet Computer</a>
    </mark>.
  </p>
  <p>
    Throughout my career I also gathered experience in project management, business requirements and UX design (from a
    developer perspective).
  </p>
  <p>
    I have a computer engineering and an executive master in business administration degrees. I speak fluently French,
    German and English.
  </p>
  <p>When I do not code, you probably find me somewhere along the river or in the mountains running trails ⛰🏃.</p>
  <p>
    If you have got any web or mobile project in mind,
    <a href="/#contact" rel="noopener noreferrer">get in touch!</a>
  </p>
</Section>

<style lang="scss">
  img {
    box-shadow: 3px 3px black;
    border: 1px solid black;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-left: 1.45rem;

    @media screen and (max-width: 960px) {
      width: 3rem;
      height: 3rem;
    }
  }
</style>
