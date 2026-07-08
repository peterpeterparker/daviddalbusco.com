<script lang="ts">
	import Section from '$lib/core/components/Section.svelte';
	import { page } from '$app/state';
</script>

<Section>
	<h2>Trails</h2>

	<p>
		Nothing recorded for {page.params.year}. <a href="/trails">Check out</a> all the trails I've been
		to!
	</p>
</Section>
