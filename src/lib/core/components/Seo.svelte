<script lang="ts">
	import { SITE_DESCRIPTION, SITE_SOCIAL_IMAGE, SITE_TITLE, SITE_URL } from '$lib/core/constants';
	import type { Thing } from 'schema-dts';
	import { renderJsonLDScriptTag } from '$lib/core/utils/linked-data.utils';
	import { SITE_LINKED_DATA } from '$lib/core/linked-data';

	interface Props {
		url?: string;
		canonical?: string | undefined;
		image?: string | undefined;
		title?: string | undefined;
		description?: string | undefined;
		noRobots?: boolean;
		linkedData?: Thing;
	}

	let {
		url = SITE_URL,
		canonical = undefined,
		image = undefined,
		title = undefined,
		description = undefined,
		noRobots = false,
		linkedData = SITE_LINKED_DATA
	}: Props = $props();

	let linkedDataScript = $derived(renderJsonLDScriptTag(linkedData));
</script>

<title>{title ?? SITE_TITLE}</title>
<link href={canonical ?? url} rel="canonical" />
<meta content={description ?? SITE_DESCRIPTION} name="description" />
<meta content={title ?? SITE_TITLE} property="og:title" />
<meta content={description ?? SITE_DESCRIPTION} property="og:description" />
<meta content="website" property="og:type" />
<meta content={url} property="og:url" />
<meta content={image ?? SITE_SOCIAL_IMAGE} property="og:image" />
<meta content="summary_large_image" name="twitter:card" />
<meta content={title ?? SITE_TITLE} name="twitter:title" />
<meta content={description ?? SITE_DESCRIPTION} name="twitter:description" />
<meta content={image ?? SITE_SOCIAL_IMAGE} name="twitter:image" />
<meta content="@daviddalbusco" name="twitter:creator" />

{#if noRobots}
	<meta name="robots" content="noindex, nofollow" />
{/if}

{@html linkedDataScript}
