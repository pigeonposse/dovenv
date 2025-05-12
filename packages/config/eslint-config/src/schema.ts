import eslintPluginJsonSchemaValidator from 'eslint-plugin-json-schema-validator'

import type {
	Config,
	ConfigParamsSuper,
} from './_types'

export type SchemaConfigParams = ConfigParamsSuper

/**
 * Generates a JSON Schema ESLint config based on the given parameters.
 *
 * @returns {Config[]} - The generated JSON Schema ESLint config.
 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator
 * @example
 * // Generates a basic JSON Schema ESLint config.
 * const config = setSchemaConfig()
 */
export const setSchemaConfig = ( ): Config[] =>
	[ ...eslintPluginJsonSchemaValidator.configs['flat/recommended'] ]

/**
 * SCHEMA ESLINT CONFIG.
 *
 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator
 */
export const schemaConfig = setSchemaConfig()

// console.dir( schemaConfig )
