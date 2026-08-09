export const onCopySnippet = async ({ target }: CustomEvent<never>) => {
	const code =
		target !== null && target instanceof HTMLButtonElement ? target.previousElementSibling : null;

	if (!code) {
		console.error(`Oopsie, code cannot be copied.`, target);
		return;
	}

	await navigator.clipboard.writeText(code.textContent);

	const icon =
		target !== null && target instanceof HTMLButtonElement ? target.querySelector('img') : null;

	if (!icon) {
		console.error(`Oopsie, cannot animate code copy feedback.`, target);
		return;
	}

	// Utter duper simplistic solution. Totally contains a race condition (icon-check might not be fetched before src is redo)
	// and there is no smooth transition between the two states. It just does it for now.
	const originalSrc = icon.src;
	icon.src = '/assets/icon-check.svg';
	setTimeout(() => {
		icon.src = originalSrc;
	}, 500);
};
