import {
	deepmergeCustom,
	process,
} from '@dovenv/utils'

import { Dovenv } from './cli'

import type {
	Config,
	Params,
} from './types'

export type {
	Config,
	Params,
}

export { Dovenv }

/**
 * Runs the build process with the given arguments.
 * @param {string[]} args Arguments to pass to the build process.
 * @example
 * import { run } from '@dovenv/core'
 *
 * await run(['-c', 'my/config.js', 'check'])
 */
export const run = async ( args: string[] ) => {

	const dovenv = new Dovenv()
	await dovenv.run( [
		process.argv[0],
		process.argv[1],
		...args,
	] )

}

/**
 * Defines and returns the given configuration object.
 * @param {...(Config | Config[])} config - The configuration object to define.
 * @returns {Config} - The defined configuration object.
 * @see https://dovenv.pigeonposse.com/guide/core
 *
 * ---
 * @example
 * // Example 1: A single configuration object
 * export default defineConfig(config1);
 * @example
 * // Example 2: Multiple configurations as arguments
 * export default defineConfig(config1, config2);
 * @example
 * // Example 3: An array of configurations
 * export default defineConfig([config1, config2]);
 */
export const defineConfig = ( ...config: ( Config | Config[] )[] ) => {

	const mergeConfig = ( ...configs: Config[] ): Config =>
		deepmergeCustom<Config>( {} )( ...configs ) as Config
	if ( config.length === 1 ) {

		const [ single ] = config

		if ( Array.isArray( single ) )
			return mergeConfig( ...single )

		return single

	}

	return mergeConfig( ...( config as Config[] ) )

}
