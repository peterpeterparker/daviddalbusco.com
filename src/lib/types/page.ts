export interface PageData<T> {
	content: string;
	metadata: T;
	slug: string;
}
export type PageDataWithoutContent<T> = Omit<PageData<T>, 'content'>;
