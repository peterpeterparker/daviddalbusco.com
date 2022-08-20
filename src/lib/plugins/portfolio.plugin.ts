import {get, list} from '$lib/plugins/markdown.plugin';
import type {MarkdownData} from '$lib/types/markdown';
import type {Portfolio, PortfolioMetadata} from '$lib/types/portfolio';

export const listPortfolio = async (): Promise<Portfolio> => {
  const results: MarkdownData<PortfolioMetadata>[] = await list<PortfolioMetadata>({path: 'portfolio'});

  const portfolio: Portfolio = results.reduce(
    (acc: Portfolio, data: MarkdownData<PortfolioMetadata>) => {
      const {metadata} = data;
      const {type} = metadata;

      const {work, play} = acc;

      if (type === 'work') {
        return {
          work: [...work, data],
          play
        };
      }

      return {
        work,
        play: [...play, data]
      };
    },
    {
      work: [],
      play: []
    }
  );

  return portfolio;
};

export const getPortfolio = async ({slug}: Record<string, string>): Promise<MarkdownData<PortfolioMetadata>> =>
  get<PortfolioMetadata>({slug, path: 'portfolio'});
