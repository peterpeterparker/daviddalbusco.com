import type { BlogMetadata } from '$lib/types/blog';
import type { PageData } from '$lib/types/page';
import type { Portfolio, PortfolioMetadata } from '$lib/types/portfolio';
import { listBlog } from '$plugins/blog.plugin';
import { listPortfolio } from '$plugins/portfolio.plugin';

export const load = async (): Promise<{
	work: PageData<PortfolioMetadata>[];
	play: PageData<PortfolioMetadata>[];
	blog: PageData<BlogMetadata>[];
}> => {
	const portfolio: Portfolio = await listPortfolio();
	const blog: PageData<BlogMetadata>[] = await listBlog();

	const { work, play } = portfolio;

	return { work, play, blog: blog.slice(0, 6) };
};
