import eslintPluginToml from 'eslint-plugin-toml'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type TomlConfigParams = ConfigParamsSuper

/**
 * Generates a TOML ESLint config based on the given parameters.
 *
 * @param   {TomlConfigParams} [params] - Parameters to customize the config.
 * @returns {Config[]}                  - The generated TOML ESLint config.
 * @example
 * // Generates a basic TOML ESLint config.
 * const config = setTomlConfig()
 *
 * // Generates a TOML ESLint config with custom rules.
 * const config = setTomlConfig({
 *   rules: {
 *     'toml/no-empty-tables': ['error'],
 *     'toml/no-inline-tables': ['warn'],
 *   },
 * })
 */
export const setTomlConfig = ( params?: TomlConfigParams ): Config[] => [
	...eslintPluginToml.configs['flat/standard'].map( d => ( {
		files : [ FILES.TOML ],
		...d,
	} ) ),
	{
		files : [ FILES.TOML ],
		rules : {
			'toml/indent' : [
				'error',
				'tab',
				{
					subTables     : 1,
					keyValuePairs : 1,
				},
			],
			...( params?.rules || {} ),
		},
	},
]

/**
 * TOML ESLINT CONFIG.
 *
 * @see https://www.npmjs.com/package/eslint-plugin-toml
 */
export const tomlConfig = setTomlConfig()

