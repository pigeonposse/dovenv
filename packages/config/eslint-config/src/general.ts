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
// @ts-ignore
import pluginPromise from 'eslint-plugin-promise'
import globals       from 'globals'
import tseslint      from 'typescript-eslint'

import {
	FILES,
	FILES_WITH_JS_OR_TS,
} from './const'

import type {
	Any,
	Config,
	ConfigParamsSuper,
} from './_types'

export { globals }

export const setTsConfigDir = ( tsconfigRootDir = import.meta.dirname ): Config => {

	return { languageOptions : { parserOptions : {
		projectService : true,
		tsconfigRootDir,
	} } }

}

export type JsConfigParams = ConfigParamsSuper

/** Aligned rules shared for js and ts */
const alignedRules: Config['rules'] = {
	'@stylistic/space-infix-ops' : [ 'error', { int32Hint: false } ],
	'@stylistic/key-spacing'     : [
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
	'@stylistic/no-multi-spaces' : [
		'error',
		{ exceptions : {
			ImportDeclaration    : true, // import x    from '...'
			VariableDeclarator   : true, // const x     = ...
			AssignmentExpression : true, // x           = ...
			TSPropertySignature  : true, // type X = { a?: string }
			PropertyDefinition   : true, // class X { x }
		// PropertyDeclaration  : true, // class X { x }
		// Property             : true, // object properties
		// TSTypeLiteral        : true, // type X = { a: string }
		// TSInterfaceBody      : true, // interface X { a: string }
		} },
	],
	'@stylistic/type-annotation-spacing' : 'off',
}

/**
 * Generates a JS ESLint config based on the given parameters.
 *
 * @param   {JsConfigParams} [params] - Parameters to customize the config.
 * @returns {Config[]}                - The generated JS ESLint config.
 * @example
 * // Generates a basic JS ESLint config.
 * const config = setJsConfig()
 *
 * // Generates a JS ESLint config with custom rules.
 * const config = setJsConfig({
 *   rules: {
 *   },
 * })
 */
export const setJsConfig = ( params?: JsConfigParams ): Config[] => [
	{
		files           : [ FILES.COMMON ],
		languageOptions : {
			globals    : { ...globals.commonjs },
			sourceType : 'commonjs',
		},
	},
	{
		files           : [ FILES.ESM ],
		languageOptions : {
			globals    : { ...globals.es2025 },
			sourceType : 'module',
		},
	},
	{ plugins : {
		...pluginPromise.configs['flat/recommended'].plugins,
		...stylistic.configs['recommended'].plugins,
		'import'            : fixupPluginRules( importPlugin ),
		'canonical'         : fixupPluginRules( pluginCanonical ),
		'align-import'      : fixupPluginRules( pluginAlignImport as Any ),
		'align-assignments' : fixupPluginRules( pluginAlignAssigments as Any ),
	} },
	{
		files           : FILES_WITH_JS_OR_TS,
		languageOptions : { globals : {
			...globals.browser,
			...globals.node,
			...globals.jquery,
		} },
		rules : {
			...eslint.configs.recommended.rules,
			...stylistic.configs['recommended'].rules,
			...pluginPromise.configs['flat/recommended'].rules,
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
			'prefer-arrow-callback'           : 'error',
			'no-async-promise-executor'       : 'off',
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
			'@stylistic/padded-blocks'           : [ 'error', 'always' ],
			'@stylistic/space-in-parens'         : [ 'error', 'always' ],
			'@stylistic/function-call-spacing'   : [ 'error', 'never' ],
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
			...alignedRules,
			...( params?.rules || {} ),
		},
	},
]

/**
 * JS CONFIG FILE.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */
export const jsConfig = setJsConfig()

export type TsConfigParams = ConfigParamsSuper

/**
 * Generates a TypeScript ESLint config based on the given parameters.
 *
 * @param   {TsConfigParams} [params] - Parameters to customize the config.
 * @returns {Config[]}                - The generated TypeScript ESLint config.
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#recommended
 * @example
 * // Generates a basic TypeScript ESLint config.
 * const config = setTsConfig()
 *
 * // Generates a TypeScript ESLint config with custom rules.
 * const config = setTsConfig({
 *   rules: {
 *   },
 * })
 */
export const setTsConfig = ( params?: TsConfigParams ): Config[] => [
	...jsConfig,
	...tseslint.configs.recommended.map( v => ( {
		files : [ FILES.TS ],
		...v,
	} ) as Config ),
	{
		files : [ FILES.TS ],
		rules : {
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
			// ...alignedRules,
			...( params?.rules || {} ),
		},
	},
	{
		files : [ FILES.COMMON ],
		rules : { '@typescript-eslint/no-require-imports': 'off' },
	},
]

/**
 * TYPESCRIPT (TS).
 *
 * Includes: jsConfig.
 *
 * @see https://typescript-eslint.io/getting-started/
 */
export const tsConfig = setTsConfig()
