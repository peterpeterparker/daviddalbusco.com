<script lang="ts">
	import Hamburger from '$lib/components/hamburger.svelte';
	import Menu from '$lib/components/menu.svelte';

	let open = $state(false);
	let hamburger: Hamburger = $state();

	const onStateChange = ({ detail }: CustomEvent<boolean>) => (open = detail);

	const close = () => hamburger.close();
</script>

<header>
	<div class="title">
		<a href="/" aria-label="Go to daviddalbusco.com home page"><h1>David Dal Busco</h1></a>
	</div>

	<div class="menu"><Hamburger bind:this={hamburger} on:state={onStateChange} /></div>
</header>

<Menu on:close={close} {open} />

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;

		padding: 0 1.45rem 0 0;

		@media screen and (max-width: 576px) {
			background: black;
		}
	}

	.title {
		height: 3rem;

		display: flex;
		align-items: center;

		background: black;
		color: #fafafa;

		padding: 0 1.45rem 0 1.25rem;
	}

	.menu {
		border-left: 0.25rem solid black;
		padding: 0 0 0 1.45rem;
	}

	h1 {
		font-size: var(--font-size-h3);
		line-height: var(--line-height-h3);
		font-weight: var(--font-weight-h3);

		margin: 0;

		@media screen and (max-width: 960px) {
			font-size: 1rem;
		}
	}

	a {
		text-decoration: none;
	}
</style>
