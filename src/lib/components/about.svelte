<script lang="ts">
  import Section from '$lib/components/section.svelte';
</script>

<Section background="var(--color-primary)" color="var(--color-primary-contrast)">
  <h2 id="about">
    About <img alt="" aria-hidden="true" loading="lazy" role="presentation" src="/icons/icon-256x256.png" />
  </h2>

  <p>Hey, nice to meet you.</p>
  <p>I'm a freelance web developer, open source enthusiast, based in Zürich, Switzerland.</p>

  <p>
    I am experienced with
    <mark>
      <a href="http://ionicframework.com" rel="noopener noreferrer">Ionic</a>
    </mark>
    ,
    <mark>
      <a href="http://angular.io" rel="noopener noreferrer">Angular</a>
    </mark>
    and
    <mark>
      <a href="https://reactjs.org" rel="noopener noreferrer">React</a>
    </mark>. I developed this website with
    <mark>
      <a href="https://svelte.dev/" rel="noopener noreferrer">Svelte</a>
    </mark>
    , used
    <mark>
      <a href="https://firebase.google.com/" rel="noopener noreferrer">Google Firebase</a>
    </mark>
    more than once and I'm a huge fan of reusable
    <mark>
      <a href="https://stenciljs.com" rel="noopener noreferrer">StencilJS</a>
    </mark>
    Web Components and vanilla JavaScript.
  </p>
  <p>
    In my humble opinion, decentralization might become the next big thing (we often need), that's why I am interested
    in blockchain networks, specially <mark>
      <a href="https://dfinity.org/" rel="noopener noreferrer">DFINITY</a>
    </mark> Internet Computer.
  </p>
  <p>
    Throughout my career I also gathered experience in project management, business requirements and UX design (from a
    developer perspective).
  </p>
  <p>
    I have a computer engineering and an executive master in business administration degrees. I speak fluently French,
    German and English.
  </p>
  <p>
    If you have got a web, Progressive Web Apps or mobile (iOS/Android) project in mind,
    <mark>
      <a href="/#contact" rel="noopener noreferrer">get in touch!</a>
    </mark>
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
