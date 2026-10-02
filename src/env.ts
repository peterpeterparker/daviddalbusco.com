import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	// schema is required by the build to identify the variable as optional (which it is)
	PUBLIC_MAPKIT_TOKEN: { public: true, schema: (value) => value },
	PUBLIC_ASSETS: { public: true }
});
