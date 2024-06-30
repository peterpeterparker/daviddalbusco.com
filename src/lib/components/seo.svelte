<script lang="ts">
	let defaultUrl = 'https://daviddalbusco.com';
	let defaultImage = `${defaultUrl}/images/social-image.jpg`;
	let defaultTitle = 'David Dal Busco';
	let defaultDescription = 'Freelance Web Developer';

	export let url: string = defaultUrl;
	export let canonical: string | undefined = undefined;
	export let image: string | undefined = undefined;
	export let title: string | undefined = undefined;
	export let description: string | undefined = undefined;
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
