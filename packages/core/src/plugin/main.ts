
import { CommandSuper } from '../_shared/_super'

import type { Config } from '../types'

/**
 * Plugin core class.
 *
 * - Contains the plugin utilities, styles etc.
 * - Makes it easy to create plugins.
 * @see https://dovenv.pigeonposse.com/guide/plugin
 */
export class PluginCore<Opts = undefined> extends CommandSuper<Opts> {

	title = 'plugin'

	constructor(
		opts?: Opts,
		config? : Config,
	) {

		super( opts, config )

	}

}

/**
 * Create a plugin function.
 * @template Param - The type of the arguments to be passed to the plugin.
 * @param {() => Config} fn - The plugin function.
 * @param {Config} dovenvConfig - Add a previous dovenv configuration if you need it.
 * @returns {(param?: Param) => Config} - The plugin function that can be passed to the dovenv.
 * @example
 * import { createPlugin } from '@dovenv/core'
 *
 * const plugin = createPlugin<{ title?: boolean }>( data => {
 * 	 if ( data.param?.title ) {
 * 		console.log( data.utils.style.title( 'Hello from plugin' ) )
 * 	 }
 *
 * 	return {
 * 		// Your dovenv configuration here.
 * 	}
 * } )
 */
export const createPlugin = <Param = unknown>(
	fn: ( data: {
		param? : Param
		utils  : PluginCore<Param>
	}  ) => Config,
	dovenvConfig?: Config,
) => {

	return ( param?: Param ) => {

		try {

			const utils = new PluginCore<Param>( param, dovenvConfig )
			return fn( {
				param,
				utils,
			} )

		}
		catch ( err ) {

			if ( err instanceof Error )
				throw console.error( err.message )
			throw console.error( err )

		}

	}

}

