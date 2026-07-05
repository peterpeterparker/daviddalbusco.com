import type { DateString } from '$lib/types/date';

export const formatDate = (dateStr: DateString): string =>
	new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
		new Date(dateStr)
	);
