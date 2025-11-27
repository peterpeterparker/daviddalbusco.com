<script lang="ts">
	let defaultUrl = 'https://daviddalbusco.com';
	let defaultImage = `${defaultUrl}/images/social-image-v3.jpg`;
	let defaultTitle = 'David Dal Busco';
	let defaultDescription = 'Freelance Web Developer';

	interface Props {
		url?: string;
		canonical?: string | undefined;
		image?: string | undefined;
		title?: string | undefined;
		description?: string | undefined;
	}

	let {
		url = defaultUrl,
		canonical = undefined,
		image = undefined,
		title = undefined,
		description = undefined
	}: Props = $props();
</script>

<title>{title ?? defaultTitle}</title>
<link href={canonical ?? url} rel="canonical" />
<meta content={description ?? defaultDescription} name="description" />
<meta content={title ?? defaultTitle} property="og:title" />
<meta content={description ?? defaultDescription} property="og:description" />
<meta content="website" property="og:type" />
<meta content={url} property="og:url" />
<meta content={image ?? defaultImage} property="og:image" />
<meta content="summary_large_image" name="twitter:card" />
<meta content={title ?? defaultTitle} name="twitter:title" />
<meta content={description ?? defaultDescription} name="twitter:description" />
<meta content={image ?? defaultImage} name="twitter:image" />
<meta content="@daviddalbusco" name="twitter:creator" />
