/* eslint-disable @stylistic/object-curly-newline */
import jsdoc from 'eslint-plugin-jsdoc'

import { Config }              from './_types'
import { FILES_WITH_JS_OR_TS } from './const'

export type JSDocConfigParmas = {
	/**
	 * Custom rules.
	 *
	 * @see https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules
	 */
	rules? : Config['rules']
}

/**
 * Generates a JSDoc ESLint config based on the given parameters.
 *
 * @param   {JSDocConfigParmas} [params] - Parameters to generate the config.
 * @returns {Config[]}                   - The generated JSDoc ESLint config.
 * @see https://github.com/gajus/eslint-plugin-jsdoc
 * @example
 * // Generates a basic JSDoc ESLint config.
 * const config = setJSDocConfig()
 *
 * // Generates a JSDoc ESLint config with custom rules.
 * const config = setJSDocConfig({
 *   rules: {
 *     'jsdoc/no-types' : [ 'error' ],
 *   },
 * })
 */
export const setJSDocConfig = ( params?: JSDocConfigParmas ): Config[] => [
	{
		files   : FILES_WITH_JS_OR_TS,
		plugins : { jsdoc },
		rules   : {
			...jsdoc.configs['flat/recommended'].rules,
			'jsdoc/sort-tags'                               : 'error',
			'jsdoc/require-jsdoc'                           : [ 'error', { require: {} } ],
			'jsdoc/require-description'                     : [ 'error', { descriptionStyle: 'body' } ],
			'jsdoc/require-hyphen-before-param-description' : [ 'error', 'always' ],
			// 'jsdoc/check-indentation'                       : 'error',
			'jsdoc/check-line-alignment'                    : [ 'error', 'always' ],
			// 'jsdoc/require-description-complete-sentence'   : [ 'error' ],
			'jsdoc/require-example'                         : 'off',
			'jsdoc/tag-lines'                               : [
				'error',
				'any',
				{
					startLines : 1,
				},
			],
			...( params?.rules || {} ),
		},
	},
]

/**
 * JSDOC Eslint config.
 *
 * @see https://github.com/gajus/eslint-plugin-jsdoc#readme
 */
export const jsdocConfig = setJSDocConfig()

