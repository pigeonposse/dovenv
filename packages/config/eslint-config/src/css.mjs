/**
 * YAML
 * @see https://github.com/aminya/eslint-plugin-yaml#readme
 */
import * as cssPlugin from 'eslint-plugin-css'

/** @type {import('eslint').Linter.Config[]} */
export default [
	cssPlugin.configs['flat/standard'],
	{
		files : [ '**/*.css', '**/*.scss' ],
		rules : { indent: [ 'error', 'tab' ] },
	},
]
