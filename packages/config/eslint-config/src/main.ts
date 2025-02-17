import cssConfig     from './css'
import generalConfig from './general'
import {
	globals,
	setTsConfig,
	tsConfig,
	jsConfig,
} from './general'
import htmlConfig   from './html'
import {
	includeGitIgnore,
	setIgnoreConfig,
} from './ignore'
import jsonConfig   from './json'
import mdConfig     from './md'
import schemaConfig from './schema'
import tomlConfig   from './toml'
import vueConfig    from './vue'
import yamlConfig   from './yml'

import type { Config } from './_types'

export {
	globals,
	includeGitIgnore,
	setIgnoreConfig,
	tsConfig,
	jsConfig,
	setTsConfig,
	htmlConfig,
	mdConfig,
	jsonConfig,
	tomlConfig,
	vueConfig,
	yamlConfig,
	schemaConfig,
	cssConfig,
	generalConfig,
}

export const config: Config[] = [
	/**
	 * GENERAL CONFIGURATION (typescript, javascript, jsdoc..)
	 */
	...generalConfig,
	/**
	 * HTML
	 */
	...htmlConfig,
	/**
	 * CSS
	 */
	...cssConfig,
	/**
	 * MARKDOWN
	 */
	...mdConfig,
	/**
	 * YAML
	 */
	...yamlConfig,
	/**
	 * JSON
	 */
	...jsonConfig,
	/**
	 * TOML
	 */
	...tomlConfig,
	/**
	 * SCHEMA
	 */
	...schemaConfig,
	/**
	 * VUE
	 */
	...vueConfig,
]

export default config
