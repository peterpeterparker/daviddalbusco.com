import type { PageData } from '$lib/core/types/page';
import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
import { listPortfolio } from '$plugins/portfolio.plugin';

export const load = async (): Promise<{
	work: PageData<PortfolioMetadata>[];
	play: PageData<PortfolioMetadata>[];
}> => {
	const { work, play } = await listPortfolio();
	return { work, play };
};
