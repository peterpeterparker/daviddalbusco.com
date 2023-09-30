import { getPortfolio } from '$lib/plugins/portfolio.plugin';
import type { MarkdownData } from '$lib/types/markdown';
import type { PortfolioMetadata } from '$lib/types/portfolio';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ portfolio: MarkdownData<PortfolioMetadata> }> => {
	const portfolio = await getPortfolio(params);
	return { portfolio };
};
