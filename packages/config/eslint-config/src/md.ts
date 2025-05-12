import { fixupPluginRules } from '@eslint/compat'
// @ts-ignore
import markdownlint from 'eslint-plugin-markdownlint'
// @ts-ignore
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js'

import { FILES } from './const'

import type {
	Any,
	Config,
	ConfigParamsSuper,
} from './_types'

export type MdConfigParams = ConfigParamsSuper
/**
 * Defines a configuration object for the dovenv markdown plugin.
 *
 * @param   {MdConfigParams} [params] - The configuration object.
 * @returns {Config[]}                The defined configuration object.
 *                                    The default configuration is based on the recommended configuration for the
 *                                    `eslint-plugin-markdownlint` plugin. You can override any of these rules by
 *                                    passing them as part of the `rules` object in the `params` object.
 * @example
 *
 * export default setMdConfig( {
 * 	rules: {
 * 		'markdownlint/md013' : 'error', // line length
 * 		'markdownlint/md024' : 'error', // Multiple headers with the same content
 * 	},
 * } )
 */
export const setMdConfig = ( params?: MdConfigParams ):Config[] => [
	{
		files           : [ FILES.MARKDOWN ],
		plugins         : { markdownlint: fixupPluginRules( markdownlint as Any ) },
		languageOptions : { parser: markdownlintParser },
		rules           : {
			...markdownlint.configs.recommended.rules as Config['rules'],
			'markdownlint/md001' : 'error',
			'markdownlint/md013' : 'off', // line length
			'markdownlint/md033' : 'off', // inline HTML
			'markdownlint/md024' : 'off', // Multiple headers with the same content
			...( params?.rules || {} ),
		},
	},
]

/**
 * MARKDOWN eslint config.
 *
 * @see https://gitlab.com/pawelbbdrozd/eslint-plugin-markdownlint
 */
export const mdConfig = setMdConfig()

