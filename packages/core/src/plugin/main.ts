import { CommandSuper } from '../_shared/cmd'

import type { Config } from '../types'

type PluginUtils = CommandSuper

/**
 * Plugin core class.
 *
 * It contains the plugin utils.
 *
 */
export class PluginCore extends CommandSuper {}

/**
 * Create a plugin function.
 * @template Args - The type of the arguments to be passed to the plugin.
 * @param {() => Config} fn - The plugin function.
 * @returns {(args?: Args) => Config} - The plugin function that can be passed to the dovenv.
 * @example
 * import { createPlugin } from '@dovenv/core'
 *
 * const plugin = createPlugin<{ title?: boolean }>( data => {
 *   const { style } = data.utils
 * 	if ( data.args?.title ) {
 * 		console.log( style.title( 'Hello from plugin' ) )
 * 	}
 *
 * 	return {
 * 		// Your dovenv configuration here.
 * 	}
 * } )
 */
export const createPlugin = <Args = unknown>( fn: ( data: {
	args? : Args
	utils : PluginUtils
}  ) => Config ) => {

	return ( args?: Args ) => {

		try {

			const pluginUtils = new CommandSuper()
			return fn( {
				args,
				utils : pluginUtils,
			} )

		}
		catch ( err ) {

			if ( err instanceof Error )
				throw console.error( err.message )
			throw console.error( err )

		}

	}

}

