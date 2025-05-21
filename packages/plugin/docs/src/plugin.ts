import { defineConfig as defineDovenvConfig } from '@dovenv/core'

import { globals }  from './_shared/const'
import { DocsCore } from './core'

import type { DocsParams } from './core/types'

const FLAGS = {
	PORT        : 'port',
	CONFIG_PATH : 'config-path',
	PKG_PATH    : 'package-path',
	FLAG        : 'flag',

} as const

const CMDS = {
	DOCS            : 'docs',
	DEV             : 'dev',
	BUILD           : 'build',
	PREVIEW         : 'preview',
	PUBLISH_CF      : 'publish-cf',
	GENERATE_ASSETS : 'generate-assets',
} as const

const opts = {
	[FLAGS.PORT] : {
		type : 'number',
		desc : 'Port to listen on',
	},
	[FLAGS.CONFIG_PATH] : {
		type : 'string',
		desc : 'Docs config path',
	},
	[FLAGS.PKG_PATH] : {
		type : 'string',
		desc : 'Custom packageJSON path',
	},
} as const

const exampleGenerateAssets = `$0 ${CMDS.DOCS} ${CMDS.GENERATE_ASSETS} --${FLAGS.FLAG}="--preset=minimal" --${FLAGS.FLAG}=public/logo.svg`
/**
 * Define a `dovenv` configuration that creates a documentation site for your workspace.
 *
 * @param   {DocsParams['config'] }         [config] - The configuration object.
 * @returns {DocsParams['utils']['config']}          The dovenv configuration object.
 */
export const docsPlugin = ( config: DocsParams['config'] = {} ) => defineDovenvConfig( {
	// @ts-ignore
	const  : { [globals.DOVENV_DOCS_CONFIG]: typeof config === 'function' ? u => u ? config( u ) : undefined : config },
	custom : { [CMDS.DOCS] : {
		desc : 'Create documentation pages',
		cmds : {
			[CMDS.DEV] : {
				desc : 'Run the documentation dev server',
				opts,
			},
			[CMDS.BUILD] : {
				desc : 'Build the documentation',
				opts,
			},
			[CMDS.PREVIEW] : {
				desc : 'Preview the documentation',
				opts,
			},
			[CMDS.PUBLISH_CF] : {
				desc : 'Publish documentation to Cloudflare pages',
				opts : {
					dir  : { desc: 'Directory of documentation build' },
					name : { desc: 'Project name' },
				},
			},
			[CMDS.GENERATE_ASSETS] : {
				desc : 'Generate assets for PWA',
				opts : { [FLAGS.FLAG] : {
					type  : 'array',
					alias : 'f',
					desc  : 'flags for pass to "@vite-pwa/assets-generator" cli',
				} },
				examples : [
					{
						cmd  : exampleGenerateAssets,
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
				cmd  : `$0 ${CMDS.DOCS} ${CMDS.DEV} --${FLAGS.PORT}=1312`,
				desc : 'Run dev server with custom port',
			},
			{
				cmd  : exampleGenerateAssets,
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
					port            : opts?.[FLAGS.PORT] as number,
					configPath      : opts?.[FLAGS.CONFIG_PATH] as string,
					packageJsonPath : opts?.[FLAGS.PKG_PATH] as string,
					debug           : opts?.verbose as boolean,
				},
			} )

			if ( cmds?.includes( CMDS.DEV ) ) await docs.dev()
			else if ( cmds?.includes( CMDS.BUILD ) ) await docs.build()
			else if ( cmds?.includes( CMDS.PREVIEW ) ) await docs.preview()
			else if ( cmds?.includes( CMDS.PUBLISH_CF ) && opts?.dir && opts?.name ) await docs.publishToCloudflare( {
				dir  : opts.dir as string,
				name : opts.name as string,
			} )
			else if ( cmds?.includes( CMDS.GENERATE_ASSETS ) ) await docs.generatePWAassets( opts?.[FLAGS.FLAG] as string[] )
			else showHelp()

		},
	} },
} )

