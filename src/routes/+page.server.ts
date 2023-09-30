import { listBlog } from '$lib/plugins/blog.plugin';
import { listPortfolio } from '$lib/plugins/portfolio.plugin';
import type { BlogMetadata } from '$lib/types/blog';
import type { MarkdownData } from '$lib/types/markdown';
import type { Portfolio, PortfolioMetadata } from '$lib/types/portfolio';

export const load = async (): Promise<{
	work: MarkdownData<PortfolioMetadata>[];
	play: MarkdownData<PortfolioMetadata>[];
	blog: MarkdownData<BlogMetadata>[];
}> => {
	const portfolio: Portfolio = await listPortfolio();
	const blog: MarkdownData<BlogMetadata>[] = await listBlog();

	const { work, play } = portfolio;

	return { work, play, blog: blog.slice(0, 4) };
};
