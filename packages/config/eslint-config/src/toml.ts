/**
 * YAML
 * @see https://www.npmjs.com/package/eslint-plugin-toml
 * @see https://ota-meshi.github.io/eslint-plugin-toml/user-guide/
 */

import eslintPluginToml from 'eslint-plugin-toml'

import type { Config } from './_types'

const config: Config[] = [
	...eslintPluginToml.configs['flat/standard'],
	{
		files : [ '**/*.toml', '**/*.tml' ],
		rules : { 'toml/indent' : [
			'error',
			'tab',
			{
				subTables     : 1,
				keyValuePairs : 1,
			},
		] },
	},
]
export default config
