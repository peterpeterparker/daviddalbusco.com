import type { PageData } from '$lib/core/types/page';
import type { PortfolioMetadata } from '$lib/portfolio/types/portfolio';
import { getPortfolio } from '$plugins/portfolio.plugin';

export const load = async ({
	params
}: {
	params: Record<string, string>;
}): Promise<{ portfolio: PageData<PortfolioMetadata> }> => {
	const portfolio = await getPortfolio(params);
	return { portfolio };
};
