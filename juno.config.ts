import {defineConfig} from '@junobuild/config';

export default defineConfig({
  satellite: {
    id: 'w43uv-5qaaa-aaaal-ar6ta-cai',
    source: 'build',
    predeploy: ['npm run build']
  }
});
