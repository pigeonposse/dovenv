/**
 * YAML
 * @see https://ota-meshi.github.io/eslint-plugin-yml/
 */
import yaml from 'eslint-plugin-yml'

/** @type {import('eslint').Linter.Config[]} */
export default [
	...yaml.configs['flat/prettier'],
	// {
	// 	files : [ '**/*.yml', '**/*.yaml' ],
	// 	rules : { 'yml/indent' : [
	// 		'error',
	// 		2,
	// 		{ indentBlockSequences: true },
	// 	] },
	// },
]
