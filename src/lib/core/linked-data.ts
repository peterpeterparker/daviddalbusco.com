import {
	AUTHOR_URL,
	BSKY_URL,
	LINKEDIN_URL,
	SITE_DESCRIPTION,
	SITE_TITLE,
	SITE_URL,
	TWITTER_URL
} from '$lib/core/constants';
import type { Person, WebSite } from 'schema-dts';

export const AUTHOR_LINKED_DATA: Person = {
	'@type': 'Person',
	'@id': AUTHOR_URL,
	name: SITE_TITLE,
	url: AUTHOR_URL,
	sameAs: [BSKY_URL, TWITTER_URL, LINKEDIN_URL]
};

export const SITE_LINKED_DATA: WebSite = {
	'@type': 'WebSite',
	'@id': SITE_URL,
	name: SITE_TITLE,
	description: SITE_DESCRIPTION,
	url: SITE_URL,
	author: AUTHOR_LINKED_DATA
};
