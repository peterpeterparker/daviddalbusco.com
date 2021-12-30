import {getPortfolio} from '$lib/plugins/portfolio.plugin';
import type {EndpointOutput} from '@sveltejs/kit';

export const get = ({params}: {params: Record<string, string>}): Promise<EndpointOutput> => getPortfolio(params);
