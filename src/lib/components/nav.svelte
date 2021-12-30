<script lang="ts">
  import Hamburger from '$lib/components/hamburger.svelte';
  import Menu from '$lib/components/menu.svelte';

  let open = false;
  let hamburger: Hamburger;

  const onStateChange = ({detail}: CustomEvent<boolean>) => (open = detail);

  const close = () => hamburger.close();
</script>

<nav>
  <Hamburger bind:this={hamburger} on:state={onStateChange} />
</nav>

<Menu on:close={close} {open} />

<style lang="scss">
  nav {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;

    display: inline-flex;
    justify-content: flex-end;

    z-index: 3;
  }
</style>
