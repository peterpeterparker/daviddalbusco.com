import {listPortfolio} from '$lib/plugins/portfolio.plugin';
import type {Portfolio} from '$lib/types/portfolio';
import type {EndpointOutput} from '@sveltejs/kit';

export const get = async (): Promise<EndpointOutput> => {
  const result: Portfolio = await listPortfolio();
  return {
    body: JSON.stringify(result)
  };
};
