import yaml from 'eslint-plugin-yml'

import { FILES } from './const'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type YamlConfigParams = ConfigParamsSuper

/**
 * Generates a YAML ESLint config based on the given parameters.
 *
 * @param   {YamlConfigParams} [params] - Parameters to customize the config.
 * @returns {Config[]}                  - The generated YAML ESLint config.
 * @see https://ota-meshi.github.io/eslint-plugin-yml/
 * @example
 * // Generates a basic YAML ESLint config.
 * const config = setYamlConfig()
 *
 * // Generates a YAML ESLint config with custom rules.
 * const config = setYamlConfig({
 *   rules: {
 *     'yml/require-string-key' : [ 'error' ],
 *   },
 * })
 */
export const setYamlConfig = ( params?: YamlConfigParams ): Config[] => [
	...yaml.configs['flat/prettier'].map( d => ( {
		...d,
		files : [ FILES.YAML ],
	} ) ),
	{
		files : [ FILES.YAML ],
		rules : { ...( params?.rules ?? {} ) },
	},
]

/**
 * YAML ESLINT CONFIG.
 *
 * @see https://ota-meshi.github.io/eslint-plugin-yml/
 */
export const yamlConfig = setYamlConfig()

