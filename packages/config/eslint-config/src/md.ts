import { fixupPluginRules } from '@eslint/compat'
// import markdown             from 'eslint-plugin-markdown'
// @ts-ignore
import markdownlint from 'eslint-plugin-markdownlint'
// @ts-ignore
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js'

import type {
	Any,
	Config,
} from './_types'

const mdLintPlugin = fixupPluginRules( markdownlint as Any )
const rules        = markdownlint.configs.recommended.rules as Config['rules']

/**
 * MARKDOWN eslint config
 * @see https://gitlab.com/pawelbbdrozd/eslint-plugin-markdownlint
 */
export const config: Config[] = [
	// ...markdown.configs.recommended as Config[],
	{
		files           : [ '**/*.md' ],
		plugins         : { markdownlint: mdLintPlugin },
		languageOptions : { parser: markdownlintParser },
		rules           : {
			...rules,
			'markdownlint/md001' : 'error',
			'markdownlint/md013' : 'off', // line length
			'markdownlint/md033' : 'off', // inline HTML
			'markdownlint/md024' : 'off', // Multiple headers with the same content
		},
	},
]

// console.log( config )
export default config
