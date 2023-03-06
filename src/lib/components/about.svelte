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
    My expertise lies in
    <mark> <a href="https://svelte.dev/" rel="noopener noreferrer">Svelte</a></mark>,
    <mark> <a href="https://angular.io" rel="noopener noreferrer">Angular</a></mark>,
    <mark>
      <a href="https://reactjs.org" rel="noopener noreferrer">React</a>
    </mark>
    and
    <mark>
      <a href="https://stenciljs.com" rel="noopener noreferrer">StencilJS</a>
    </mark>, but I'm truly passionate about developing agnostic libraries and components with vanilla
    JavaScript/TypeScript.
  </p>
  <p>
    I strongly believe that decentralization and taking back ownership of our data is the way forward. This is why I'm
    interested in blockchain networks and a big fan of the <mark>
      <a href="https://internetcomputer.org/" rel="noopener noreferrer">Internet Computer</a>
    </mark>.
  </p>
  <p>
    In addition to my technical skills, I have experience in project management, business requirements, and UX design
    from a developer's perspective. I hold degrees in Computer Engineering and Executive Master in Business
    Administration. I speak fluently French, German, and English.
  </p>
  <p>When I'm not coding, you'll probably find me running trails in the mountains or along the river ⛰🏃.</p>
  <p>
    If you have a web or mobile project in mind, feel free
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
