/**
 * MARKDOWN
 * @see https://gitlab.com/pawelbbdrozd/eslint-plugin-markdownlint
 */

import { fixupPluginRules } from '@eslint/compat'
// import markdown             from 'eslint-plugin-markdown'
import markdownlint       from 'eslint-plugin-markdownlint'
import markdownlintParser from 'eslint-plugin-markdownlint/parser.js'

const mdLintPlugin = fixupPluginRules( markdownlint )
const rules        = markdownlint.configs.recommended.rules

/** @type {import('eslint').Linter.Config[]} */
export default [
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
