import { CommandSuper } from '../_shared/cmd'

import type { Config } from '../types'

/**
 * Create a plugin function.
 * @template Args - The type of the arguments to be passed to the plugin.
 * @param {() => Config} fn - The plugin function.
 * @returns {(args?: Args) => Config} - The plugin function that can be passed to the dovenv.
 * @example
 * import { createPlugin } from '@dovenv/core'
 *
 * const plugin = createPlugin<{ title?: boolean }>( data => {
 *
 * 	if ( data.args?.title ) {
 * 		console.log( data.style.title( 'Hello from plugin' ) )
 * 	}
 *
 * 	return {
 * 		// Your dovenv configuration here.
 * 	}
 * } )
 */
export const createPlugin = <Args = unknown>( fn: ( data: { args?: Args } & CommandSuper ) => Config ) => {

	const props = new CommandSuper()
	return ( args?: Args ) => {

		try {

			return fn( {
				args,
				...props,
			} )

		}
		catch ( err ) {

			if ( err instanceof Error )
				throw console.error( err.message )
			throw console.error( err )

		}

	}

}

