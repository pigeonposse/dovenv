/* eslint-disable camelcase */
import { experimental__eslintEncreasePerformance } from './_performance'
import { FILES }                                   from './const'
import {
	setCssConfig,
	cssConfig,
} from './css'
import {
	globals,
	setTsConfig,
	setJsConfig,
	setTsConfigDir,
	tsConfig,
	jsConfig,
} from './general'
import {
	htmlConfig,
	setHtmlConfig,
} from './html'
import {
	includeGitIgnore,
	setIgnoreConfig,
} from './ignore'
import {
	jsdocConfig,
	setJSDocConfig,
} from './jsdoc'
import {
	jsonConfig,
	setJsonConfig,
	packageJsonConfig,
	setPackageJsonConfig,
} from './json'
import {
	mdConfig,
	setMdConfig,
} from './md'
import {
	schemaConfig,
	setSchemaConfig,
} from './schema'
import { setSvelteConfig } from './svelte'
import {
	playwrightConfig,
	setPlaywrightConfig,
} from './test'
import {
	tomlConfig,
	setTomlConfig,
} from './toml'
import {
	vueConfig,
	setVueConfig,
} from './vue'
import {
	yamlConfig,
	setYamlConfig,
} from './yml'

import type { Config } from './_types'

export type ConfigParams = {
	/** @default 'js' */
	general    : 'ts' | 'js'
	jsdoc      : boolean
	css        : boolean
	html       : boolean
	md         : boolean
	json       : boolean
	package    : boolean
	yaml       : boolean
	toml       : boolean
	schema     : boolean
	vue        : boolean
	playwright : boolean | Parameters<typeof setPlaywrightConfig>[0]
	// svelte     : boolean | Parameters<typeof setSvelteConfig>[0]
	/**
	 * Ignore files from gitignore.
	 * If a string is provided, it will be used as the path to the .gitignore file.
	 *
	 * @default false
	 */
	gitignore  : boolean | string
	/**
	 * Ignore files from a list.
	 */
	ignore     : string[]
}

/**
 * Set all eslint config at once.
 *
 * @param   {Partial<ConfigParams>}          props      - List of config to enable.
 * @param   {(config: Config[]) => Config[]} [callback] - If provided, the config will be passed to the callback,
 *                                                      and the returned value will be used instead of the default config.
 * @returns {Config[]}                                  - The list of config.
 */
export const setConfig = (
	props: Partial<ConfigParams>,
	callback?: ( config: Config[] ) => Config[],
): Config[] => {

	const allConfig = [
		...( props.general === 'ts' ? tsConfig : jsConfig ),
		...( props.jsdoc ? jsdocConfig : [] ),
		...( props.css ? cssConfig : [] ),
		...( props.html ? htmlConfig : [] ),
		...( props.md ? mdConfig : [] ),
		...( props.json ? jsonConfig : [] ),
		...( props.package ? packageJsonConfig : [] ),
		...( props.yaml ? yamlConfig : [] ),
		...( props.toml ? tomlConfig : [] ),
		...( props.schema ? schemaConfig : [] ),
		...( props.vue ? vueConfig : [] ),
		...( props.playwright ? setPlaywrightConfig( typeof props.playwright === 'boolean' ? undefined : props.playwright ) : [] ),
		// ...( props.svelte ? setSvelteConfig( typeof props.svelte === 'boolean' ? undefined : props.svelte ) : [] ),
		...( props.gitignore ? [ includeGitIgnore( typeof props.gitignore === 'string' ? props.gitignore : undefined ) ] : [] ),
		...( props.ignore && Array.isArray( props.ignore ) ? [ setIgnoreConfig( props.ignore ) ] : [] ),
	]
	if ( callback ) return callback( allConfig )

	return allConfig

}

export {
	globals,
	includeGitIgnore,
	setIgnoreConfig,
	jsConfig,
	setJsConfig,
	tsConfig,
	setTsConfig,
	setTsConfigDir,
	jsdocConfig,
	setJSDocConfig,
	htmlConfig,
	setHtmlConfig,
	cssConfig,
	setCssConfig,
	mdConfig,
	setMdConfig,
	jsonConfig,
	setJsonConfig,
	packageJsonConfig,
	setPackageJsonConfig,
	tomlConfig,
	setTomlConfig,
	yamlConfig,
	setYamlConfig,
	schemaConfig,
	setSchemaConfig,
	vueConfig,
	setVueConfig,
	playwrightConfig,
	setPlaywrightConfig,
	experimental__eslintEncreasePerformance,
	setSvelteConfig,
	FILES,
}

/**
 * Default dovenv eslint config.
 *
 * Includes:
 * - jsConfig
 * - tsConfig
 * - jsdocConfig
 * - htmlConfig
 * - mdConfig
 * - yamlConfig
 * - jsonConfig
 * - packageJsonConfig
 * - tomlConfig.
 */
export const config: Config[] = [
	...tsConfig,
	...jsdocConfig,
	...htmlConfig,
	...mdConfig,
	...yamlConfig,
	...jsonConfig,
	...packageJsonConfig,
	...tomlConfig,
]

export default config

// console.dir( config )
