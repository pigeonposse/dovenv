/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig as defineDovenvConfig } from '@dovenv/core'

import { globals } from './_shared/const'
import { Docs }    from './run'

import type { DocsConfig } from './main'

/**
 * Define a `dovenv` configuration that creates a documentation site for your workspace.
 * @param {DocsConfig} [conf] - The configuration object.
 * @returns {import('dovenv').Config} The dovenv configuration object.
 */
export const docsPlugin = ( conf?: DocsConfig ) => {

	return defineDovenvConfig( {
		const : {
			[globals.DOVENV_DOCS_CONFIG] : conf as Record<string, unknown>,
		},
		custom : { docs : {
			desc : 'Create documentation pages',
			cmds : {
				dev     : { desc: 'Run the documentation dev server' },
				build   : { desc: 'Build the documentation' },
				preview : { desc: 'Preview the documentation' },
			},
			opts : {
				port : {
					type : 'number',
					desc : 'Port to listen on',
				},
			},
			settings : {
				wrapConsole : false,
			},
			fn : async ( { cmds, showHelp, opts } ) => {

				// if ( !conf?.configPath ) throw new Error( 'No config path provided' )
				// console.info( `Docs Configuration file path: ${conf.configPath}` )

				const docs = new Docs( conf, {
					debug : opts?.verbose as boolean,
					port  : opts?.port as number,
				} )
				if ( cmds?.includes( 'dev' ) ) await docs.dev()
				else if ( cmds?.includes( 'build' ) ) await docs.build()
				else if ( cmds?.includes( 'preview' ) ) await docs.preview()
				else showHelp()

			},
		} } } )

}
