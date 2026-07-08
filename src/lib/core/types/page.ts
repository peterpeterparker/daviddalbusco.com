import type { Slug } from '$lib/core/types/slug';

export interface PageData<T> {
	content: string;
	metadata: T;
	slug: Slug;
}
export type PageDataWithoutContent<T> = Omit<PageData<T>, 'content'>;
