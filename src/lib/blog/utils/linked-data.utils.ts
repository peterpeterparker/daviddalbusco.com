import type { BlogMetadata } from '$lib/blog/types/blog';
import type { BlogPosting } from 'schema-dts';
import { SITE_URL } from '$lib/core/constants';
import { BLOG_URL } from '$lib/blog/constants';
import { AUTHOR_LINKED_DATA } from '$lib/core/linked-data';

export const toLinkedData = ({
	canonical,
	title,
	description,
	image,
	date: datePublished,
	tags
}: BlogMetadata): BlogPosting => ({
	'@type': 'BlogPosting',
	'@id': canonical,
	headline: title,
	description,
	datePublished,
	image,
	keywords: tags,
	inLanguage: 'en',
	url: canonical,
	mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
	isPartOf: { '@id': BLOG_URL },
	author: AUTHOR_LINKED_DATA
});