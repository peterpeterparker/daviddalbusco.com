import { initOrbiter } from '@junobuild/analytics';

export const initAnalytics = async () => {
	const prod = import.meta.env.PROD;

	if (!prod) {
		return;
	}

	await initOrbiter();
};
