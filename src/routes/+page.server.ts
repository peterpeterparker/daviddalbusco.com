import type { BlogMetadata } from '#lib/blog/types/blog.js';
import type { PageData } from '#lib/core/types/page.js';
import type { Portfolio, PortfolioMetadata } from '#lib/portfolio/types/portfolio.js';
import { listBlog } from '#plugins/blog.plugin.js';
import { listPortfolio } from '#plugins/portfolio.plugin.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<{
	work: PageData<PortfolioMetadata>[];
	play: PageData<PortfolioMetadata>[];
	blog: PageData<BlogMetadata>[];
}> => {
	const portfolio: Portfolio = await listPortfolio();
	const blog: PageData<BlogMetadata>[] = await listBlog();

	const { work, play } = portfolio;

	return { work, play, blog: blog.slice(0, 6) };
};
