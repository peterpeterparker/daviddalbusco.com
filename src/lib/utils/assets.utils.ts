import { env } from '$env/dynamic/public';

export const assetUrl = (url: string): string =>
	url.replaceAll('https://daviddalbusco.com/assets', env.PUBLIC_ASSETS);
