import { init } from 'yawa-tracker';

export const initAnalytics = async () => {
	const prod = import.meta.env.PROD;

	if (!prod) {
		return;
	}

	init({
		serverUrl: 'https://analytics.fluster.io'
	});
};
