/* eslint-disable @stylistic/object-curly-newline */

import { defineConfig as defineDovenvConfig } from '@dovenv/core'

import { globals } from './_shared/const'
import { Docs }    from './run'

import type { DocsConfig }             from './main'
import type { Config as DovenvConfig } from '@dovenv/core'

export type DocsPluginConfig =  DocsConfig | ( ( config?: DovenvConfig ) => Promise<DocsConfig> )

/**
 * Define a `dovenv` configuration that creates a documentation site for your workspace.
 * @param {DocsPluginConfig} [conf] - The configuration object.
 * @returns {import('@dovenv/core').Config} The dovenv configuration object.
 */
export const docsPlugin = ( conf?: DocsPluginConfig ) => {

	return defineDovenvConfig( {
		const : {
			[globals.DOVENV_DOCS_CONFIG] : conf || {},
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
			fn : async ( { cmds, showHelp, opts, config } ) => {

				const docsConfig =  ( typeof conf === 'function' ? await conf( config ) : conf )

				const docs = new Docs( docsConfig, {
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
