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
 * @param {Config} [params] - Optional configuration for the plugin.
 */
export const templatesPlugin = ( params?: Config ) => defineConfig( { custom : { templates : {
	desc : 'Toolkit for templates',
	opts : { key : {
		alias : 'k',
		desc  : 'Key pattern',
		type  : 'array',
	} },
	cmds : { list: { desc: 'list of availale keys' } },
	fn   : async ( {
		utils, cmds, opts,
	} ) => {

		const keys = opts?.key as string[] | undefined
		const temp = new Templates( {
			opts : params,
			utils,
		} )

		if ( cmds?.includes( 'list' ) ) await temp.list( keys )
		else await temp.run( keys )

	},
} } } )

export default templatesPlugin
