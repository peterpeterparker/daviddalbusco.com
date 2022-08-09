import {getBlob} from '$lib/plugins/blog.plugin';
import type {ResponseBody} from '@sveltejs/kit';

export const GET = ({params}: {params: Record<string, string>}): Promise<ResponseBody> => getBlob(params);
