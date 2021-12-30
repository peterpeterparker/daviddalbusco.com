import {getBlob} from '$lib/plugins/blog.plugin';
import type {EndpointOutput} from '@sveltejs/kit';

export const get = ({params}: {params: Record<string, string>}): Promise<EndpointOutput> => getBlob(params);
