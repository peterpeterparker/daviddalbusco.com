<script lang="ts">
  import Section from '$lib/components/section.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
  <h2 id="about">
    About <img alt="" aria-hidden="true" loading="lazy" role="presentation" src="/icons/icon-256x256.png" />
  </h2>

  <p>Hi there! It's great to meet you! 👋</p>
  <p>I'm a freelance web developer and contractor based in Zürich, Switzerland.</p>

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
    </mark>, but I'm particularly passionate about developing agnostic JavaScript/TypeScript solutions.
  </p>
  <p>
    I believe in the principles of decentralization and data ownership, which is why I have a keen interest in
    blockchain networks. As a proud supporter of the <mark>
      <a href="https://internetcomputer.org/" rel="noopener noreferrer">Internet Computer</a>
    </mark>, I see tremendous potential in its future.
  </p>
  <p>
    In addition to my technical skills, I have experience in project management, business requirements analysis, and UX
    design from a developer's perspective. I hold degrees in Computer Engineering and an Executive Master's in Business
    Administration. I'm also fluent in French, German, and English.
  </p>
  <p>
    When I'm not busy coding, you can often find me running on mountain trails or along the river. It's my way of
    finding peace and staying active. ⛰🏃
  </p>
  <p>
    If you have a web or mobile project in mind, feel free to
    <a href="/#contact" rel="noopener noreferrer">reach out!</a> I would be more than happy to discuss how I can contribute
    to the success of your project.
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
