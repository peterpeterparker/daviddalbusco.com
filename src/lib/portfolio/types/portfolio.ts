import type { PageData } from '$lib/core/types/page';

export type PortfolioType = 'work' | 'play';

export interface PortfolioMetadata {
	title: string;
	description: string;
	icon?: string;
	background?: string;
	type: PortfolioType;
	order?: string;
	status?: 'active' | 'maintenance' | 'archived' | 'experiment';
}

export interface Portfolio {
	work: PageData<PortfolioMetadata>[];
	play: PageData<PortfolioMetadata>[];
}
