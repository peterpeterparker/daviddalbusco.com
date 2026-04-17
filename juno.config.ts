import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		ids: {
			production: 'w43uv-5qaaa-aaaal-ar6ta-cai'
		},
		hosting: {
			source: 'build',
			predeploy: ['pnpm run build'],
		},
		storage: {
			headers: [
				{
					source: '/icons/**/*',
					headers: [['Cache-Control', 'max-age=31536000']]
				},
				{
					source: '/images/**/*',
					headers: [['Cache-Control', 'max-age=31536000']]
				},
				{
					source: '/fonts/**/*',
					headers: [['Cache-Control', 'max-age=31536000']]
				}
			]
		}
	},
	orbiter: {
		id: '3iier-sqaaa-aaaal-aczaa-cai'
	}
});
