import type { PageData } from '#lib/core/types/page.js';
import { isEmptyString } from '#lib/core/utils/nullish.utils.js';
import type { PortfolioMetadata } from '#lib/portfolio/types/portfolio.js';
import { getPortfolio } from '#plugins/portfolio.plugin.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params: { slug }
}): Promise<{ portfolio: PageData<PortfolioMetadata> }> => {
	if (isEmptyString(slug)) {
		error(404, 'Not found');
	}

	const portfolio = await getPortfolio({ slug });
	return { portfolio };
};
