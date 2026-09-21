import {BLOG_DESCRIPTION, BLOG_TITLE, BLOG_URL} from '$lib/blog/constants';
import { BSKY_URL,LINKEDIN_URL, SITE_TITLE, SITE_URL, TWITTER_URL } from '$lib/core/constants';
import type { Blog, WebSite, Person, Thing } from 'schema-dts';

const authorIdAndUrl = `${SITE_URL}/#about`;

export const AUTHOR_LINKED_DATA: Person = {
	'@type': 'Person',
	'@id': authorIdAndUrl,
	name: SITE_TITLE,
	url: authorIdAndUrl,
	sameAs: [BSKY_URL, TWITTER_URL, LINKEDIN_URL]
};

const site: WebSite = {
	'@type': 'WebSite',
	'@id': SITE_URL,
	name: SITE_TITLE,
	url: SITE_URL,
	author: AUTHOR_LINKED_DATA
};

const blog: Blog = {
	'@type': 'Blog',
	'@id': BLOG_URL,
	name: BLOG_TITLE,
	description: BLOG_DESCRIPTION,
	url: BLOG_URL,
	isPartOf: {
		'@type': 'WebSite',
		'@id': SITE_URL
	},
	author: { '@id': authorIdAndUrl }
};

const renderJsonLDScriptTag = (thing: Thing): string =>
	`<script type="application/ld+json">${JSON.stringify(thing, null, 2)}</script>`;

export const SITE_LINKED_DATA_SCRIPT = renderJsonLDScriptTag(site);
export const BLOG_LINKED_DATA_SCRIPT = renderJsonLDScriptTag(blog);
