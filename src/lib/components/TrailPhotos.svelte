<script lang="ts">
    import type {TrailMetadata} from "$lib/types/trail";

    let dialog = $state<HTMLDialogElement | undefined>(undefined);

    interface Props {
        photos: TrailMetadata["photos"];
    }

    let {photos}: Props = $props();
</script>

<ul>
    {#each photos as photo, i (i)}
        <li><img alt="" aria-hidden="true" loading="lazy" role="presentation" src={photo} /></li>
    {/each}
</ul>

<dialog bind:this={dialog}>
    sadklasdkasml
</dialog>