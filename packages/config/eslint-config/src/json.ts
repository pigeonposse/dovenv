/**
 * JSON
 * @see https://github.com/JoshuaKGoldberg/eslint-plugin-package-json#readme
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/
 */

import jsonc       from 'eslint-plugin-jsonc'
import packageJson from 'eslint-plugin-package-json/configs/recommended'
import jsoncParser from 'jsonc-eslint-parser'

import type { Config } from './_types'

const recomendedConfig = jsonc.configs['flat/recommended-with-jsonc'] as Config[]
export const config: Config[] = [
	...recomendedConfig,
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
	packageJson as Config,
	{
		files : [ '**/package.json' ],
		rules : {
			'@stylistic/no-trailing-spaces'      : 'error',
			'@stylistic/no-multiple-empty-lines' : [
				'error',
				{
					max    : 0,
					maxEOF : 0,
				},
			],
			'jsonc/sort-array-values' : [
				'error',
				{
					pathPattern : '^files$', // Hits the files property
					order       : { type: 'asc' },
				},
				{
					pathPattern : '^keywords$', // Hits the keywords property
					order       : [
						'eslint',
						'eslintplugin',
						'eslint-plugin',
						{ order: { type: 'asc' } },
					],
				},
			],
			'package-json/no-redundant-files' : 'error',
			'package-json/require-version'    : 'off',
		},
	},
]
export default config
