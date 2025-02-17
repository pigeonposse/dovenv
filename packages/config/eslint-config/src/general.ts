import { fixupPluginRules } from '@eslint/compat'
import eslint               from '@eslint/js'
import stylistic            from '@stylistic/eslint-plugin'
// @ts-ignore
import pluginAlignAssigments from 'eslint-plugin-align-assignments'
// @ts-ignore
import pluginAlignImport from 'eslint-plugin-align-import'
// @ts-ignore
import pluginCanonical from 'eslint-plugin-canonical'
// @ts-ignore
import importPlugin from 'eslint-plugin-import'
import jsdoc        from 'eslint-plugin-jsdoc'
// @ts-ignore
import pluginPromise from 'eslint-plugin-promise'
import globals       from 'globals'
import tseslint      from 'typescript-eslint'

import type {
	Any,
	Config,
} from './_types'

export { globals }

export const setTsConfig = ( tsconfigRootDir = import.meta.dirname ): Config => {

	return { languageOptions : { parserOptions : {
		projectService : true,
		tsconfigRootDir,
	} } }

}

export const jsConfig: Config[] = [
	eslint.configs.recommended,
	stylistic.configs['recommended-flat'],
	// @see https://github.com/import-js/eslint-plugin-import
	// importPlugin.flatConfigs.recommended,
	// @see https://github.com/eslint-community/eslint-plugin-promise
	pluginPromise.configs['flat/recommended'],
	{
		languageOptions : { globals : {
			...globals.browser,
			...globals.node,
			...globals.jquery,
		} },
		plugins : {
			'import'            : fixupPluginRules( importPlugin ),
			'canonical'         : fixupPluginRules( pluginCanonical ),
			'align-import'      : fixupPluginRules( pluginAlignImport as Any ),
			'align-assignments' : fixupPluginRules( pluginAlignAssigments as Any ),
			'@stylistic'        : stylistic,
		},
		rules : {
			'camelcase'             : 'warn',
			'vars-on-top'           : 'warn',
			'default-case-last'     : 'error',
			'default-case'          : 'error',
			'no-prototype-builtins' : 'off',
			'no-inline-comments'    : 'off',
			'no-unused-vars'        : [
				'error',
				{
					args                      : 'all',
					argsIgnorePattern         : '^_',
					caughtErrorsIgnorePattern : '^_',
					ignoreRestSiblings        : true,
				},
			],
			'one-var' : [
				'error',
				{
					var   : 'always',
					let   : 'always',
					const : 'never',
				},
			],
			'prefer-const' : [
				'error',
				{
					destructuring          : 'any',
					ignoreReadBeforeAssign : false,
				},
			],
			'func-style' : [
				'error',
				'declaration',
				{ allowArrowFunctions: true },
			],
			'prefer-arrow-callback'     : 'error',
			'no-async-promise-executor' : 'off',
			// CODING STYLES
			// '@stylistic/max-len' : [
			// 	'error',
			// 	{
			// 		code                   : 100,
			// 		ignoreTrailingComments : true,
			// 		ignoreUrls             : true,
			// 		ignoreStrings          : true,
			// 		ignoreTemplateLiterals : true,
			// 	},
			// ],
			'@stylistic/key-spacing'    : [
				'error',
				{
					multiLine : {
						beforeColon : true,
						afterColon  : true,
					},
					align : {
						beforeColon : true,
						afterColon  : true,
						on          : 'colon',
					},
				},
			],
			'@stylistic/switch-colon-spacing' : [
				'error',
				{
					after  : true,
					before : true,
				},
			],
			'@stylistic/comma-dangle'            : [ 'error', 'always-multiline' ],
			'@stylistic/comma-spacing'           : [ 'error', { after: true } ],
			'@stylistic/no-multiple-empty-lines' : [
				'error',
				{
					max    : 1,
					maxEOF : 1,
					maxBOF : 1,
				},
			],
			'@stylistic/padded-blocks'   : [ 'error', 'always' ],
			'@stylistic/space-in-parens' : [ 'error', 'always' ],

			'@stylistic/object-curly-spacing'    : [ 'error', 'always' ],
			'@stylistic/object-curly-newline'    : [ 'error', { minProperties: 2 } ],
			'@stylistic/object-property-newline' : [ 'error', { allowMultiplePropertiesPerLine: false } ],
			'@stylistic/array-bracket-spacing'   : [ 'error', 'always' ],
			'@stylistic/array-bracket-newline'   : [
				'error',
				{
					multiline : true,
					minItems  : 3,
				},
			],
			'@stylistic/array-element-newline' : [
				'error',
				{
					multiline : true,
					minItems  : 3,
				},
			],
			'@stylistic/keyword-spacing'    : [ 'error', { after: true } ],
			'@stylistic/indent'             : [ 'error', 'tab' ],
			'@stylistic/indent-binary-ops'  : [ 'error', 'tab' ],
			'@stylistic/no-tabs'            : 'off',
			'@stylistic/spaced-comment'     : 'off',
			'@stylistic/linebreak-style'    : [ 'error', 'unix' ],
			'@stylistic/semi'               : [ 'error', 'never' ],
			'@stylistic/operator-linebreak' : [ 'error', 'before' ],
			'@stylistic/arrow-parens'       : [ 'error', 'as-needed' ],
			'@stylistic/eol-last'           : [ 'error', 'always' ],
			'@stylistic/space-infix-ops'    : 'error',
			'@stylistic/no-multi-spaces'    : [
				'error',
				{ exceptions : {
					ImportDeclaration    : true,
					VariableDeclarator   : true,
					AssignmentExpression : true,
				} },
			],
			'@stylistic/type-annotation-spacing' : 'off',

			// IMPORTS
			'import/newline-after-import' : 'error',
			'import/order'                : [
				'error',
				{
					'groups' : [
						[ 'builtin', 'external' ],
						[
							'internal',
							'parent',
							'sibling',
							'index',
							'object',
						],
						[ 'type' ],
					],
					'alphabetize' : {
						order           : 'asc',
						caseInsensitive : true,
					},
					'newlines-between'        : 'always',
					'warnOnUnassignedImports' : true,
				},
			],
			// ALIGN IMPORTS and ASSIGNMENTS
			'align-import/align-import'           : 'error',
			'align-import/trim-import'            : 'error',
			'align-assignments/align-assignments' : [ 'error' ],
			'canonical/import-specifier-newline'  : 'error',
			'canonical/export-specifier-newline'  : 'error',
		},
	},
]

export const tsConfig: Config[] = tseslint.config(
	...jsConfig,
	tseslint.configs.recommended,
	// ...tseslint.configs.strict,
	// ...tseslint.configs.stylistic,
	{ rules : {
		'no-unused-vars'                    : 'off',
		'@typescript-eslint/no-unused-vars' : [
			'error',
			{
				args                           : 'all',
				argsIgnorePattern              : '^_',
				caughtErrors                   : 'all',
				caughtErrorsIgnorePattern      : '^_',
				destructuredArrayIgnorePattern : '^_',
				varsIgnorePattern              : '^_',
				ignoreRestSiblings             : true,
			},
		],
		// '@typescript-eslint/ban-ts-comment'          : [ 'error', { 'ts-ignore': 'allow-with-description' } ],
		'@typescript-eslint/ban-ts-comment'         : [ 'error', { 'ts-ignore': false } ],
		'@typescript-eslint/prefer-as-const'        : 'error',
		'@typescript-eslint/method-signature-style' : 'error',

		// Note: you must disable the base rule as it can report incorrect errors
		'no-unused-expressions'                      : 'off',
		'@typescript-eslint/no-unused-expressions'   : 'off',
		// Note: you must disable the base rule as it can report incorrect errors
		'no-empty-function'                          : 'off',
		'@typescript-eslint/no-empty-function'       : 'off',
		'@typescript-eslint/consistent-type-imports' : 'off',
		'@typescript-eslint/no-useless-empty-export' : 'error',
		'@stylistic/no-multi-spaces'                 : 'off',
	} },
) as Config[] // cause ts plugin use deprected type FlatConfig

const config: Config[] = [
	/**
	 * GENERAL
	 *  @see https://eslint.org/docs/user-guide/configuring
	 */
	...jsConfig,
	/**
	 * TYPESCRIPT (TS)
	 *  @see https://typescript-eslint.io/getting-started/
	 */
	...tsConfig,
	{
		files           : [ '**/*.svelte' ],
		languageOptions : { parserOptions: { parser: tseslint.parser } },
	},
	// ...tseslint.config({
	// 	plugins: {
	// 	  '@typescript-eslint': tseslint.plugin,
	// 	},
	// 	languageOptions: {
	// 	  parser: tseslint.parser,
	// 	  parserOptions: {
	// 		warnOnUnsupportedTypeScriptVersion: false,
	// 		projectService: true,
	// 		tsconfigRootDir: import.meta.dirname,
	// 	  },
	// 	},
	// }),
	/**
	 * JSDOC
	 *  @see https://github.com/gajus/eslint-plugin-jsdoc#readme
	 */
	jsdoc.configs['flat/recommended'],
	{
		files   : [ '*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}' ],
		plugins : { jsdoc },
		rules   : {
			'jsdoc/sort-tags'                               : 'error',
			'jsdoc/require-jsdoc'                           : [ 'error', { require: {} } ],
			'jsdoc/require-description'                     : [ 'error', { descriptionStyle: 'body' } ],
			'jsdoc/require-hyphen-before-param-description' : [ 'error', 'always' ],
			'jsdoc/check-indentation'                       : 'error',
			'jsdoc/check-line-alignment'                    : [ 'error', 'always' ],
			'jsdoc/require-description-complete-sentence'   : [ 'error' ],
			'jsdoc/require-example'                         : 'error',
		},
	},
	/**
	 * COOMON FILES
	 */
	{
		files           : [ '**/*.cjs', '**/*.cts' ],
		languageOptions : {
			globals    : { ...globals.commonjs },
			sourceType : 'commonjs',
		},
		rules : { '@typescript-eslint/no-require-imports': 'off' },
	},
	{
		files           : [ '**/*.mjs', '**/*.mts' ],
		languageOptions : {
			globals    : { ...globals.es2025 },
			sourceType : 'module',
		},
	},
]

export default config
