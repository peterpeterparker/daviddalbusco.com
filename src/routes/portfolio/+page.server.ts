import {listPortfolio} from '$lib/plugins/portfolio.plugin';
import type {MarkdownData} from '$lib/types/markdown';
import type {PortfolioMetadata} from '$lib/types/portfolio';

export const load = async (): Promise<{
  work: MarkdownData<PortfolioMetadata>[];
  play: MarkdownData<PortfolioMetadata>[];
}> => {
  const {work, play} = await listPortfolio();
  return {work, play};
};
