import { PUBLIC_ASSETS } from '$app/env/public';

export const assetUrl = (url: string): string =>
	url.replaceAll('https://daviddalbusco.com/assets', PUBLIC_ASSETS);
