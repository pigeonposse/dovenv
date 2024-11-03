
/**
 * SVELTE
 *  @see https://typescript-eslint.io/getting-started/
 */

import eslintPluginSvelte from 'eslint-plugin-svelte'

import { generealConfig } from './html.mjs'

/** @type {import('eslint').Linter.Config[]} */
const config = [
	...eslintPluginSvelte.configs['flat/recommended'],
	{
		...generealConfig(),
		files : [ '**/*.svelte' ],
	},
]

export const svelteConfig = config
export default config
