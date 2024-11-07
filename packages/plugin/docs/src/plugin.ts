/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig as defineDovenvConfig } from 'dovenv'

import { description } from './.vitepress/const'
import { Docs }        from './run'

type PluginConfig = {
	/** The path to the DOCUMENTATION configuration file. */
	configPath? : string
}

/**
 * Define a config for dovenv that creates a documentation site for your workspace.
 * @param {PluginConfig} [conf] - The configuration object.
 * @param {string} [conf.configPath] - The path to the configuration file.
 * @returns {import('dovenv').Config} The dovenv configuration object.
 */
export const config = ( conf?: PluginConfig ) => {

	return defineDovenvConfig( { custom : { docs : {
		desc : description,
		cmds : {
			dev     : { desc: 'Run the documentation dev server' },
			build   : { desc: 'Build the documentation' },
			preview : { desc: 'Preview the documentation' },
		},
		fn : async ( { cmds, showHelp, opts } ) => {

			if ( !conf?.configPath ) throw new Error( 'No config path provided' )
			console.info( `Docs Configuration file path: ${conf.configPath}` )

			const docs = new Docs( {
				configPath : conf.configPath,
				debug      : opts?.verbose as boolean,
			} )
			if ( cmds?.includes( 'dev' ) ) await docs.dev()
			else if ( cmds?.includes( 'build' ) ) await docs.build()
			else if ( cmds?.includes( 'preview' ) ) await docs.preview()
			else showHelp()

		},
	} } } )

}
