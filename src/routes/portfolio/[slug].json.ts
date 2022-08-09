import {getPortfolio} from '$lib/plugins/portfolio.plugin';
import type {ResponseBody} from '@sveltejs/kit';

export const get = ({params}: {params: Record<string, string>}): Promise<ResponseBody> => getPortfolio(params);
