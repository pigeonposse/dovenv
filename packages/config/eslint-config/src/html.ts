import html from '@html-eslint/eslint-plugin'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type HtmlConfigParmas = ConfigParamsSuper

/**
 * Set HTML ESLint config.
 *
 * Generates an HTML ESLint config based on the given parameters.
 *
 * @param   {HtmlConfigParmas} [params] - Custom rules to apply.
 * @returns {Config[]}                  - The generated HTML ESLint config.
 * @see https://html-eslint.org/docs/rules
 * @example
 * // Generates a basic HTML ESLint config.
 * const config = setHtmlConfig()
 *
 * // Generates an HTML ESLint config with custom rules.
 * const config = setHtmlConfig({
 *   rules: {
 *     '@html-eslint/indent' : [ 'error', 'tab' ],
 *     '@html-eslint/sort-attrs' : [ 'error' ],
 *     // ... other rules
 *   },
 * })
 */
export const setHtmlConfig = ( params?: HtmlConfigParmas ): Config[] => [
	{
		...html.configs['flat/recommended'] as Config,
		files : [ FILES.HTML ],
		rules : {
			'@html-eslint/indent'               : [ 'error', 'tab' ],
			'@html-eslint/sort-attrs'           : [ 'error' ],
			'@html-eslint/quotes'               : [ 'error', 'double' ],
			'@html-eslint/element-newline'      : [ 'error', { skip: [ 'li' ] } ],
			'@html-eslint/attrs-newline'        : 'error',
			'@html-eslint/no-script-style-type' : 'error',
			'@html-eslint/no-duplicate-id'      : 'error',
			'@html-eslint/no-obsolete-tags'     : 'error',
			'@html-eslint/require-li-container' : 'error',
			'@html-eslint/no-multiple-h1'       : 'error',
			'@html-eslint/require-closing-tags' : 'error',
			'@html-eslint/lowercase'            : 'error',
			'@html-eslint/require-attrs'        : [
				'error',
				{
					tag  : 'img',
					attr : 'alt',
				},
				{
					tag  : 'img',
					attr : 'src',
				},
				{
					tag  : 'svg',
					attr : 'viewBox',
				},
			],
			...( params?.rules ? params.rules : {} ),
		},
	},
]

/**
 * HTML Eslint config.
 *
 * @see https://html-eslint.org/docs/rules
 */
export const htmlConfig = setHtmlConfig( )

