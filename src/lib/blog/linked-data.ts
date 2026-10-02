import { BLOG_DESCRIPTION, BLOG_TITLE, BLOG_URL } from '#lib/blog/constants.js';
import type { BlogMetadata } from '#lib/blog/types/blog.js';
import { AUTHOR_URL, SITE_URL } from '#lib/core/constants.js';
import { AUTHOR_LINKED_DATA } from '#lib/core/linked-data.js';
import type { Blog, BlogPosting } from 'schema-dts';

export const BLOG_LINKED_DATA: Blog = {
	'@type': 'Blog',
	'@id': BLOG_URL,
	name: BLOG_TITLE,
	description: BLOG_DESCRIPTION,
	url: BLOG_URL,
	isPartOf: {
		'@type': 'WebSite',
		'@id': SITE_URL
	},
	author: { '@id': AUTHOR_URL }
};

export const blogPostToLinkedData = ({
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
