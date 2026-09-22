import { AUTHOR_URL, SITE_URL } from '$lib/core/constants';
import { AUTHOR_LINKED_DATA } from '$lib/core/linked-data';
import { PORTFOLIO_DESCRIPTION, PORTFOLIO_TITLE, PORTFOLIO_URL } from '$lib/portfolio/constants';
import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
import type { Article, CollectionPage } from 'schema-dts';

export const PORTFOLIO_LINKED_DATA: CollectionPage = {
	'@type': 'CollectionPage',
	'@id': PORTFOLIO_URL,
	name: PORTFOLIO_TITLE,
	description: PORTFOLIO_DESCRIPTION,
	url: PORTFOLIO_URL,
	isPartOf: {
		'@type': 'WebSite',
		'@id': SITE_URL
	},
	author: { '@id': AUTHOR_URL }
};

export const portfolioToLinkedData = ({
	title,
	description,
	canonical
}: PortfolioMetadata & { canonical: string }): Article => ({
	'@type': 'Article',
	'@id': canonical,
	headline: title,
	description,
	url: canonical,
	inLanguage: 'en',
	mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
	isPartOf: { '@id': PORTFOLIO_URL },
	author: AUTHOR_LINKED_DATA
});
