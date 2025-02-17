/**
 * PLAYWRIGHT
 * @see https://www.npmjs.com/package/eslint-plugin-playwright
 */

import playwright from 'eslint-plugin-playwright'

import type { Config } from './_types'

const config: Config[] = [
	{
		...playwright.configs['flat/recommended'],
		files : [ 'tests/**' ],
	},
]

export default config
