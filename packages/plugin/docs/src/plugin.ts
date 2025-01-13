
import {
	defineConfig as defineDovenvConfig,
	PluginCore,
} from '@dovenv/core'

import { globals } from './_shared/const'
import { Docs }    from './run'

import type { DocsConfig }             from './main'
import type { DocsParams }             from './run'
import type { Config as DovenvConfig } from '@dovenv/core'

export type DocsPluginConfig =  DocsConfig | ( ( config?: DovenvConfig ) => Promise<DocsConfig> )

export class DocsPlugin extends PluginCore<DocsPluginConfig> {

	#docs
	title = 'docs'
	constructor( opts?: DocsPluginConfig, config?: DovenvConfig, public docsOpts?:DocsParams ) {

		super( opts, config )

		this.#docs = new Docs( config, docsOpts )

	}

	async dev( flags?: string[] ) {

		return await this.#docs.dev( flags )

	}

	async preview( flags?: string[] ) {

		return await this.#docs.preview( flags )

	}

	async build( flags?: string[] ) {

		return await this.#docs.build( flags )

	}

	/**
	 * Generate assets for PWA
	 * @param {string[]} [flags] Flags to pass '@vite-pwa/assets-generator' cli
	 * @see https://vite-pwa-org.netlify.app/assets-generator/cli.html
	 */
	async generatePWAassets( flags?: string[]  ) {

		await this.execPkgBin( '@vite-pwa/assets-generator', flags, { forceExec: true } )

	}

	async publishToCloudflare( opts: {
		dir  : string
		name : string
	} ) {

		await this.execPkgBin( 'wrangler', [
			'pages',
			'deploy',
			opts.dir,
			`--project-name=${opts.name}`,
		] )

	}

}

/**
 * Define a `dovenv` configuration that creates a documentation site for your workspace.
 * @param {DocsPluginConfig} [conf] - The configuration object.
 * @returns {DovenvConfig} The dovenv configuration object.
 */
export const docsPlugin = ( conf: DocsPluginConfig = {} ) => {

	return defineDovenvConfig( {
		const  : { [globals.DOVENV_DOCS_CONFIG]: conf },
		custom : { docs : {
			desc : 'Create documentation pages',
			cmds : {
				'dev' : {
					desc : 'Run the documentation dev server',
					opts : { port : {
						type : 'number',
						desc : 'Port to listen on',
					} },
				},
				'build' : {
					desc : 'Build the documentation',
					opts : { port : {
						type : 'number',
						desc : 'Port to listen on',
					} },
				},
				'preview' : {
					desc : 'Preview the documentation',
					opts : { port : {
						type : 'number',
						desc : 'Port to listen on',
					} },
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
			settings : { wrapConsole: false },
			fn       : async ( {
				cmds, showHelp, opts, config,
			} ) => {

				const docsConfig =  ( typeof conf === 'function' ? await conf( config ) : conf )

				const docs = new DocsPlugin( docsConfig, config, {
					debug : opts?.verbose as boolean,
					port  : opts?.port as number,
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

}
