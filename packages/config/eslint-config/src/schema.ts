/**
 * SCHEMA
 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator
 */

import eslintPluginJsonSchemaValidator from 'eslint-plugin-json-schema-validator'

import type { Config } from './_types'

export const config: Config[] = [ ...eslintPluginJsonSchemaValidator.configs['flat/recommended'] ]
export default config
