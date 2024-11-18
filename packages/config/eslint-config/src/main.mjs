import cssConfig     from './css.mjs'
import generalConfig from './general.mjs'
import {
	globals,
	setTsConfig,
	tsConfig,
	jsConfig,
} from './general.mjs'
import htmlConfig   from './html.mjs'
import {
	includeGitIgnore,
	setIgnoreConfig,
} from './ignore.mjs'
import jsonConfig   from './json.mjs'
import mdConfig     from './md.mjs'
import schemaConfig from './schema.mjs'
import tomlConfig   from './toml.mjs'
import vueConfig    from './vue.mjs'
import yamlConfig   from './yml.mjs'

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

/** @type {import('eslint').Linter.Config[]} */
export const config = [
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
