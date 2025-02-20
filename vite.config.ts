import juno from '@junobuild/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), juno()],
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
			}
		}
	}
});
