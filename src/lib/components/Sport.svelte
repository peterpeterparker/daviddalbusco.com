<script lang="ts">
    import type {Sport} from "$lib/types/trail";

    interface Props {
        sport: Sport;
    }

    let {sport}: Props = $props();
</script>

<mark>
    {#if sport === "trail-running"}
        Trail Running
        {:else if sport ==="gravel"}
        Gravel Bike
        {:else}
        Road Bike
        {/if}
</mark>
