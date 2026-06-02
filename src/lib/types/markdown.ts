export interface MarkdownData<T> {
	content: string;
	metadata: T;
	slug: string;
}
export type MarkdownDataWithoutContent<T> = Omit<MarkdownData<T>, 'content'>;
