import * as dovenv      from './packages/config/eslint-config/src/main.mjs'
import { svelteConfig } from './packages/config/eslint-config/src/svelte.mjs'

export default [
	dovenv.includeGitIgnore(),
	...dovenv.config,
	...svelteConfig,
]
