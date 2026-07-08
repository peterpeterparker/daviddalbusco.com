import { init, trackAsync } from 'yawa-tracker';

export const initAnalytics = async () => {
	const prod = import.meta.env.PROD;

	if (!prod) {
		return;
	}

	init({
		serverUrl: 'https://analytics.fluster.io'
	});
};

type TrackEvent =
	| { name: 'contact-hero' }
	| { name: 'contact-about' }
	| { name: 'contact-talks' }
	| { name: 'contact-menu' };

export const track = async ($event: TrackEvent) => {
	const prod = import.meta.env.PROD;

	if (!prod) {
		return;
	}

	await trackAsync($event);
};
