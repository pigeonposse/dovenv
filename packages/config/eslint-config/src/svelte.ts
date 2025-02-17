
/**
 * SVELTE
 *  @see https://typescript-eslint.io/getting-started/
 */

import eslintPluginSvelte from 'eslint-plugin-svelte'

import type { Config } from './_types'

const config: Config[] = [
	...eslintPluginSvelte.configs['flat/recommended'],
	// {
	// 	...generealConfig(),
	// 	files : [ '**/*.svelte' ],
	// },
	{
		files : [ '**/*.svelte' ],
		rules : {
			'align-import/align-import' : 'off',
			'align-import/trim-import'  : 'off',
			'no-undef'                  : 'off',
			'one-var'                   : 'off',
			'svelte/button-has-type'    : [
				'error',
				{
					button : true,
					submit : true,
					reset  : true,
				},
			],
			'svelte/spaced-html-comment' : [ 'error', 'always' ],
			'svelte/indent'              : [
				'error',
				{
					indent                    : 'tab',
					ignoredNodes              : [],
					switchCase                : 1,
					alignAttributesVertically : false,
				},
			],
			'prefer-const'           : 'off',
			'svelte/no-at-html-tags' : 'off',
			'import/order'           : [
				'error',
				{
					'groups' : [
						// Native modules (builtin) and externals
						[ 'builtin', 'external' ],
						// Internal
						[
							// example: import api from "@/services/api"
							'internal',
							// example: import config from "../config"
							'parent',
							// example: import logger from "./logger"
							'sibling',
							// example: import main from "./"
							'index',
						],
						// Types
						[ 'type' ],
						// special object import. Not used
						[ 'object' ],
					],
					'pathGroups' : [
						{
							pattern  : '$*/**',
							group    : 'index',
							position : 'after',
						},
						{
							pattern  : '**/*.{css,sass,scss,postcss}',
							group    : 'internal',
							position : 'before',
						},
					],
					'named'       : true,
					'alphabetize' : {
						order           : 'asc',
						caseInsensitive : false,
					},
					'newlines-between'        : 'always',
					'warnOnUnassignedImports' : true,
					'distinctGroup'           : false,
				},
			],
		},
	},
	{
		files : [ '**/+*.ts', '**/*.svelte' ],
		rules : { 'jsdoc/require-jsdoc': 'off' },
	},
	{
		files : [ '**/*.js' ],
		rules : { 'jsdoc/valid-types': 'off' },
	},
]

export const svelteConfig = config
export default config
