import { defineConfig as defineDovenvConfig } from '@dovenv/core'

import { globals }  from './_shared/const'
import { DocsCore } from './core'

import type { DocsParams } from './core/types'

const opts = {
	'port' : {
		type : 'number',
		desc : 'Port to listen on',
	},
	'config-path' : {
		type : 'string',
		desc : 'Docs config path',
	},
	'pkg-path' : {
		type : 'string',
		desc : 'Custom packageJSON path',
	},
} as const

/**
 * Define a `dovenv` configuration that creates a documentation site for your workspace.
 *
 * @param   {DocsParams['config'] }         [config] - The configuration object.
 * @returns {DocsParams['utils']['config']}          The dovenv configuration object.
 */
export const docsPlugin = ( config: DocsParams['config'] = {} ) => defineDovenvConfig( {
	// @ts-ignore
	const  : { [globals.DOVENV_DOCS_CONFIG]: config },
	custom : { docs : {
		desc : 'Create documentation pages',
		cmds : {
			'dev' : {
				desc : 'Run the documentation dev server',
				opts,
			},
			'build' : {
				desc : 'Build the documentation',
				opts,
			},
			'preview' : {
				desc : 'Preview the documentation',
				opts,
			},
			'publish-cf' : {
				desc : 'Publish documentation to Cloudflare pages',
				opts : {
					dir  : { desc: 'Directory of documentation build' },
					name : { desc: 'Project name' },
				},
			},
			'generate-assets' : {
				desc : 'Generate assets for PWA',
				opts : { flag : {
					type  : 'array',
					alias : 'f',
					desc  : 'flags for pass to "@vite-pwa/assets-generator" cli',
				} },
				examples : [
					{
						cmd  : '$0 docs generate-assets --flag="--preset=minimal" --flag=public/logo.svg',
						desc : 'Generate assets',
					},
					{
						cmd  : 'https://vite-pwa-org.netlify.app/assets-generator/cli.html',
						desc : 'View docs',
					},
				],
			},
		},
		examples : [
			{
				cmd  : '$0 docs dev --port 1312',
				desc : 'Run dev server with custom port',
			},
			{
				cmd  : '$0 docs generate-assets --flag="--preset=minimal" --flag=public/logo.svg',
				desc : 'Generate assets',
			},
		],
		// settings : { wrapConsole: false },
		fn : async ( {
			cmds, showHelp, opts, utils,
		} ) => {

			const docs = new DocsCore( {
				utils,
				opts : {
					port            : opts?.port as number,
					configPath      : opts?.['config-path'] as string,
					packageJsonPath : opts?.['package-path'] as string,
					debug           : opts?.verbose as boolean,
				},
			} )

			if ( cmds?.includes( 'dev' ) ) await docs.dev()
			else if ( cmds?.includes( 'build' ) ) await docs.build()
			else if ( cmds?.includes( 'preview' ) ) await docs.preview()
			else if ( cmds?.includes( 'publish-cf' ) && opts?.dir && opts?.name ) await docs.publishToCloudflare( {
				dir  : opts.dir as string,
				name : opts.name as string,
			} )
			else if ( cmds?.includes( 'generate-assets' ) ) await docs.generatePWAassets( opts?.flag as string[] )
			else showHelp()

		},
	} },
} )

