
import { defineConfig as defineDovenvConfig } from 'dovenv'

import { description } from './.vitepress/const'
import { run }         from './run'

import type { DocsConfig } from './.vitepress/config/types'

export type { DocsConfig }

// eslint-disable-next-line @stylistic/object-curly-newline
type PluginConfig = {
	/** The path to the DOCUMENTATION configuration file. */
	configPath? : string }

/**
 * Defines a configuration object for the documentation plugin.
 * @param {DocsConfig} conf - The configuration object.
 * @returns {DocsConfig} The defined configuration object.
 */
export const defineConfig = ( conf: DocsConfig ) =>
	conf

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
			dev     : { desc: 'Run the dev server' },
			build   : { desc: 'Run the build process' },
			preview : { desc: 'Run the preview server' },
		},
		fn : async ( { cmds } ) => {

			// console.log( 'cmds', cmds )
			if ( !conf?.configPath ) throw new Error( 'No config path provided' )
			if ( !cmds ) throw new Error( 'No command provided. Use "dev", "build", or "preview"' )
			const preFlags  = [ 'runtime', 'file' ]
			const postFlags = [ '--config', conf.configPath ]
			const flags     = ( f: string[] ) => [
				...preFlags,
				...f,
				...postFlags,
			]

			// console.log( 'flags', flags, cmds?.includes( 'dev' )  )
			if ( cmds?.includes( 'dev' ) ) return await run( { argv: flags( [ 'dev' ] ) } )
			else if ( cmds?.includes( 'build' ) ) return await run( { argv: flags( [ 'build' ] ) } )
			else if ( cmds?.includes( 'preview' ) ) return await run( { argv: flags( [ 'preview' ] ) } )
			await run(  { argv: flags( [ '--help' ] ) } )
			throw new Error( 'Unexpected command provided. Use "dev", "build", or "preview"' )

		},
	} } } )

}
