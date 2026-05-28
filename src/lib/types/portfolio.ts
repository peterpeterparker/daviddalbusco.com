import type { MarkdownData } from '$lib/types/markdown';

export type PortfolioType = 'work' | 'play';

export interface PortfolioMetadata {
	title: string;
	description: string;
	icon: string;
	background: string;
	type: PortfolioType;
	order?: string;
	status?: 'active' | 'maintenance' | 'archived';
}

export interface Portfolio {
	work: MarkdownData<PortfolioMetadata>[];
	play: MarkdownData<PortfolioMetadata>[];
}
