/**
 * YAML
 * @see https://ota-meshi.github.io/eslint-plugin-yml/
 */
import yaml from 'eslint-plugin-yml'

import type { Config } from './_types'

const config: Config[] = [
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
export default config

