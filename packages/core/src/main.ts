import {
	deepmergeCustom,
	process,
} from '@dovenv/utils'

import { run } from './cli'

import type { Config } from './types'

export { Config }

export const build = async ( args: string[] ) => {

	await run( [
		process.argv[0],
		process.argv[2],
		...args,
	] )

}

/**
 * Defines and returns the given configuration object.
 * @param {Config | Config[]} config - The configuration object to define.
 * @returns {Config} - The defined configuration object.
 */
export const defineConfig = ( config: Config | Config[] ) => {

	if ( Array.isArray( config ) ) return mergeConfig( ...config )
	return config

}

/**
 * Merges multiple configuration objects into a single configuration object.
 * @param {...Config[]} configs - The configuration objects to merge.
 * @returns {Config} - The merged configuration object.
 */
export const mergeConfig = ( ...configs: Config[] ): Config =>
	deepmergeCustom<Config>( {} )( ...configs ) as Config
