import { AUTHOR_URL, SITE_URL } from '$lib/core/constants';
import { AUTHOR_LINKED_DATA } from '$lib/core/linked-data';
import { TRAILS_DESCRIPTION, TRAILS_TITLE, TRAILS_URL } from '$lib/trails/constants';
import type { TrailMetadata } from '$lib/trails/types/trail';
import type { Article, CollectionPage } from 'schema-dts';

export const TRAILS_LINKED_DATA: CollectionPage = {
	'@type': 'CollectionPage',
	'@id': TRAILS_URL,
	name: TRAILS_TITLE,
	description: TRAILS_DESCRIPTION,
	url: TRAILS_URL,
	isPartOf: {
		'@type': 'WebSite',
		'@id': SITE_URL
	},
	author: { '@id': AUTHOR_URL }
};

export const trailToLinkedData = ({
	canonical,
	title,
	description,
	image,
	date: datePublished,
	sport
}: TrailMetadata & { description: string; canonical: string; image: string }): Article => ({
	'@type': 'Article',
	'@id': canonical,
	headline: title,
	description,
	datePublished,
	image,
	keywords: sport,
	inLanguage: 'en',
	url: canonical,
	mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
	isPartOf: { '@id': TRAILS_URL },
	author: AUTHOR_LINKED_DATA
});
