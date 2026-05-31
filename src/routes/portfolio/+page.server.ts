import type { MarkdownData } from '$lib/types/markdown';
import type { PortfolioMetadata } from '$lib/types/portfolio';
import { listPortfolio } from '$plugins/portfolio.plugin';

export const load = async (): Promise<{
	work: MarkdownData<PortfolioMetadata>[];
	play: MarkdownData<PortfolioMetadata>[];
}> => {
	const { work, play } = await listPortfolio();
	return { work, play };
};
