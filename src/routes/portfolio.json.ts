import {listPortfolio} from '$lib/plugins/portfolio.plugin';
import type {Portfolio} from '$lib/types/portfolio';
import type {ResponseBody} from '@sveltejs/kit';

export const get = async (): Promise<ResponseBody> => {
  const result: Portfolio = await listPortfolio();
  return {
    body: JSON.stringify(result)
  };
};
