import { Examples } from './lib'

import type { Config }                 from './types'
import type { Config as DovenvConfig } from '@dovenv/core'

export type * from './types'
export { Examples }

/**
 * A plugin for `dovenv` providing tools for managing example paths.
 *
 * @param   {Config}       [conf] - Configuration for the plugin.
 * @returns {DovenvConfig}        - The plugin configuration with custom examples.
 */
export const examplesPlugin = ( conf?: Config ): DovenvConfig => {

	return { custom : { examples : {
		desc : 'Toolkit for managing example paths',
		opts : { key : {
			alias : 'k',
			desc  : 'Key pattern',
			type  : 'array',
		} },
		fn : async ( {
			utils, opts,
		} ) => {

			const temp = new Examples( {
				opts : conf,
				utils,
			} )
			await temp.run( opts?.key as string[] )

		},
	} } }

}

export default examplesPlugin
