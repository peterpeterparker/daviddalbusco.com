<script lang="ts">
	import { SITE_DESCRIPTION, SITE_SOCIAL_IMAGE, SITE_TITLE, SITE_URL } from '$lib/core/constants';

	interface Props {
		url?: string;
		canonical?: string | undefined;
		image?: string | undefined;
		title?: string | undefined;
		description?: string | undefined;
	}

	let {
		url = SITE_URL,
		canonical = undefined,
		image = undefined,
		title = undefined,
		description = undefined
	}: Props = $props();
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
