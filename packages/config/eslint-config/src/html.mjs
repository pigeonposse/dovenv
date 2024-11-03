/**
 * HTML
 *  @see https://www.npmjs.com/package/eslint-plugin-html
 */

import html       from '@html-eslint/eslint-plugin'
import htmlPlugin from 'eslint-plugin-html'

export const generealConfig = rules => ( {
	...html.configs['flat/recommended'],
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
		...( rules ? rules : {} ),
	},
} )
/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files           : [ '**/*.html', '**/*.we' ],
		plugins         : { htmlPlugin },
		languageOptions : { sourceType: 'module' },
		settings        : {
			'html/xtml-extensions' : [ '.html' ],
			'html/html-extensions' : [ '.html', '.we' ], // consider .html and .we files as HTML
			// 'html/indent'          : 'tab', // indentation is one tab at the beginning of the line.
		},
	},
	{
		// recommended configuration included in the plugin
		...generealConfig( {
			'@html-eslint/require-closing-tags' : 'error',
			'@html-eslint/lowercase'            : 'error',
		} ),
		files : [ '**/*.html' ],
	},
]
