import { defineConfig } from '@junobuild/config';

export default defineConfig({
	satellite: {
		id: 'w43uv-5qaaa-aaaal-ar6ta-cai',
		source: 'build',
		predeploy: ['npm run build'],
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
	}
});
