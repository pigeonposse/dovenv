/**
 * PLAYWRIGHT
 * @see https://www.npmjs.com/package/eslint-plugin-playwright
 */
import playwright from 'eslint-plugin-playwright'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		...playwright.configs['flat/recommended'],
		files : [ 'tests/**' ],
	},
]
