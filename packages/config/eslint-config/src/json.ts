import jsonc       from 'eslint-plugin-jsonc'
import packageJson from 'eslint-plugin-package-json'
import jsoncParser from 'jsonc-eslint-parser'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type PackageJsonConfigParams = ConfigParamsSuper
export type JsonConfigParmas = ConfigParamsSuper

/**
 * Generates a package.json ESLint config based on the given parameters.
 *
 * @param   {PackageJsonConfigParams} [params] - Parameters to customize the config.
 * @returns {Config[]}                         - The generated package.json ESLint config.
 * @see https://ota-meshi.github.io/eslint-plugin-package-json
 * @example
 * // Generates a basic package.json ESLint config.
 * const config = setPackageJsonConfig()
 *
 * // Generates a package.json ESLint config with custom rules.
 * const config = setPackageJsonConfig({
 *   rules: {
 *     'package-json/require-version' : 'error',
 *   },
 * })
 */
export const setPackageJsonConfig = ( params?: PackageJsonConfigParams ): Config[] => [
	{
		...packageJson.configs.recommended,
		files : [ FILES.PACKAGEJSON ],
		rules : {
			...packageJson.configs.recommended.rules,
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
			...( params?.rules || {} ),
		},
	},
]

/**
 * Generates a JSON ESLint config based on the given parameters.
 *
 * @param   {JsonConfigParmas} [params] - Parameters to customize the JSON rules.
 * @returns {Config[]}                  - The generated JSON ESLint config.
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/
 * @example
 * // Generates a basic JSON ESLint config.
 * const config = setJsonConfig()
 *
 * // Generates a JSON ESLint config with custom rules.
 * const config = setJsonConfig({
 *   rules: {
 *     'jsonc/no-dupe-keys': ['error'],
 *   },
 * })
 */
export const setJsonConfig = ( params?: JsonConfigParmas ): Config[] => [
	...jsonc.configs['flat/recommended-with-jsonc'].map( d => ( {
		...d,
		files : [ FILES.JSON ],
	} ) as Config ),
	{
		files           : [ FILES.JSON ],
		languageOptions : { parser: jsoncParser },
		rules           : {
			'@stylistic/no-trailing-spaces'      : 'error',
			'@stylistic/no-multiple-empty-lines' : [
				'error',
				{
					max    : 0,
					maxEOF : 0,
				},
			],
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
			...( params?.rules || {} ),
		},
	},
]

/**
 * JSON ESLINT CONFIG.
 *
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/user-guide/
 */
export const jsonConfig = setJsonConfig()

/**
 * PACKAGE JSON ESLINT CONFIG.
 *
 * @see https://github.com/JoshuaKGoldberg/eslint-plugin-package-json#readme
 */
export const packageJsonConfig = setPackageJsonConfig()
