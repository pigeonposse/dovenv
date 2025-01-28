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
	cmds : { list: { desc: 'list of availale keys' } },
	fn   : async ( {
		config, cmds, opts,
	} ) => {

		const temp = new Templates( conf, config )
		const keys = opts?.key as string[] | undefined
		if ( cmds?.includes( 'list' ) ) await temp.list( keys )
		else await temp.run( keys )

	},
} } } )

export default templatesPlugin
