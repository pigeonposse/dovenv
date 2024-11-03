/**
 * SCHEMA
 * @see https://ota-meshi.github.io/eslint-plugin-json-schema-validator
 */

import eslintPluginJsonSchemaValidator from 'eslint-plugin-json-schema-validator'

/** @type {import('eslint').Linter.Config[]} */
export default [ ...eslintPluginJsonSchemaValidator.configs['flat/recommended'] ]
