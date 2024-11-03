/**
 * JSON
 * @see https://github.com/JoshuaKGoldberg/eslint-plugin-package-json#readme
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/
 */

import jsonc       from 'eslint-plugin-jsonc'
import packageJson from 'eslint-plugin-package-json/configs/recommended'
import jsoncParser from 'jsonc-eslint-parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
	...jsonc.configs['flat/recommended-with-jsonc'],
	{
		files : [
			'**/*.json',
			'**/*.json5',
			'**/*.jsonc',
		],
		languageOptions : { parser: jsoncParser },
		rules           : {
			'jsonc/indent' : [
				'error',
				'tab',
				{},
			],
			'jsonc/quotes'                  : [ 'error', 'double' ],
			'jsonc/key-spacing'             : [ 'error', { mode: 'strict' } ],
			'jsonc/array-bracket-newline'   : [ 'error', 'always' ],
			'jsonc/array-element-newline'   : [ 'error', 'always' ],
			'jsonc/object-property-newline' : [ 'error', {} ],
		},
	},
	packageJson,
]
