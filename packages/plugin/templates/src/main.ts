/* eslint-disable jsdoc/require-returns */
import { defineConfig } from '@dovenv/core'

import { Templates } from './lib'

import type { Config } from './types'

export {
	Config,
	Templates,
}

/**
 * A plugin for dovenv to create templates.
 * @param {Config} [conf] - Optional configuration for the plugin.
 */
export const templatesPlugin = ( conf?: Config ) => defineConfig( { custom : { templates : {
	desc : 'Toolkit for templates',
	opts : { key : {
		alias : 'k',
		desc  : 'Key pattern',
		type  : 'array',
	} },
	fn : async ( { config } ) => {

		const temp = new Templates( conf, config )
		await temp.run()

	},
} } } )

export default templatesPlugin
