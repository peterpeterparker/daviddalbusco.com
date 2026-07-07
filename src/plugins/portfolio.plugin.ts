import type { PageData } from '$lib/types/page';
import type { Portfolio, PortfolioMetadata } from '$lib/types/portfolio';
import { get, list } from '$plugins/markdown.plugin';

export const listPortfolio = async (): Promise<Portfolio> => {
	const results = await list<PortfolioMetadata>({
		path: 'portfolio'
	});

	return results.reduce<Portfolio>(
		(acc, data) => {
			const { metadata } = data;
			const { type } = metadata;

			const { work, play } = acc;

			const order = (
				{ metadata: { order: orderA } }: PageData<PortfolioMetadata>,
				{ metadata: { order: orderB } }: PageData<PortfolioMetadata>
			) => parseInt(orderA ?? '0') - parseInt(orderB ?? '0');

			if (type === 'work') {
				return {
					work: [...work, data].sort(order),
					play
				};
			}

			return {
				work: work,
				play: [...play, data].sort(order)
			};
		},
		{
			work: [],
			play: []
		}
	);
};

export const getPortfolio = ({
	slug
}: Record<string, string>): Promise<PageData<PortfolioMetadata>> =>
	get<PortfolioMetadata>({ slug, path: 'portfolio' });
