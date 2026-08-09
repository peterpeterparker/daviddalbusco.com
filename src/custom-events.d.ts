declare module 'svelte/elements' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	export interface HTMLAttributes<T> {
		onddbCopySnippet?: (event: CustomEvent<never>) => void;
	}
}

export {};
