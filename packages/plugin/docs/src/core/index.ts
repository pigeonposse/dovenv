import { getCommandUtils } from '@dovenv/core'
import {
	replaceStd,
	deprecatedAlerts,
} from '@dovenv/core/utils'

import { DocsParams }    from './types'
import { VITEPRESS_DIR } from '../.vitepress/config'
import {
	name,
	version,
	vitepressVersion,
	homepage,
} from '../_shared/const'
import { setConfigGlobals } from '../config'

export class DocsCore {

	protected utils : DocsParams['utils']
	public opts     : DocsParams['opts']

	constructor( {
		utils,
		opts,
	}: DocsParams ) {

		this.opts          = opts
		this.utils         = utils
		this.utils.title   = 'docs'
		this.utils.helpURL = homepage

		console.debug( { opts } )

	}

	// Set globals for read in .vitepress/config
	async #setGlobals() {

		setConfigGlobals( {
			configPath      : this.opts?.configPath,
			packageJsonPath : this.opts?.packageJsonPath,
		} )

	}

	async #runVipressCli( type: 'dev' | 'build' | 'preview', flags?: string[] ) {

		const depAlert = deprecatedAlerts()
		depAlert.hide()

		const outputReplaced = replaceStd( {
			params : {
				vitepress                : name,
				[`/.${name}`]            : `/.vitepress`,
				[`v${vitepressVersion}`] : `v${version}`,
			},
			type : [ 'stderr', 'stdout' ],
		} )

		try {

			outputReplaced.start()

			await this.#setGlobals()

			const path    = VITEPRESS_DIR
			const oldArgv = process.argv

			this.utils.process.argv = [
				...this.utils.process.argv.slice( 0, 2 ),
				type,
				path,
				...( flags ?? [] ),
				...( this.opts?.port ? [ `--port=${this.opts.port}` ] : [] ),
			]

			console.debug( { 'docs-cli-argv': this.utils.process.argv } )

			this.utils.prompt.log.info( `${this.utils.style.info.b( type )} process starting...\n` )

			// @ts-ignore
			await import( 'vitepress/dist/node/cli.js' )
			this.utils.process.argv = oldArgv

		}
		catch ( error ) {

			console.error( error instanceof Error ? error.message : error )
			outputReplaced.stop()
			this.utils.process.exit( 0 )

		}

	}

	/**
	 * __Starts the development server__.
	 *
	 * This command is a wrapper of the `npx vitepress dev` command.
	 *
	 * @param {string[]} [flags] - Flags to pass to the underlying `vitepress dev`
	 *                           command. The `--force` flag is always passed to ensure the server starts
	 *                           without prompting the user.
	 */
	async dev( flags?: string[] ) {

		await this.#runVipressCli( 'dev', [ ...( flags ?? [] ), '--force' ] )

	}

	/**
	 * __Builds the documentation site__.
	 *
	 * This command is a wrapper of the `npx vitepress build` command.
	 *
	 * @param {string[]} [flags] - Flags to pass to the underlying `vitepress build`
	 *                           command. This allows for customization and control over the build process.
	 */
	async build( flags?: string[] ) {

		await this.#runVipressCli( 'build', flags )

	}

	/**
	 * __Starts the preview server__.
	 *
	 * This command is a wrapper of the `npx vitepress preview` command.
	 *
	 * @param {string[]} [flags] - Flags to pass to the underlying `vitepress preview`
	 *                           command. This allows for customization and control over the preview process.
	 */
	async preview( flags?: string[] ) {

		await this.#runVipressCli( 'preview', flags )

	}

	/**
	 * Generate assets for PWA.
	 *
	 * @param {string[]} [flags] - Flags to pass '@vite-pwa/assets-generator' cli.
	 * @see https://vite-pwa-org.netlify.app/assets-generator/cli.html
	 */
	async generatePWAassets( flags?: string[] ) {

		await this.utils.execPkgBin( '@vite-pwa/assets-generator', flags, { forceExec: true } )

	}

	async publishToCloudflare( opts: {
		dir  : string
		name : string
	} ) {

		await this.utils.execPkgBin( 'wrangler', [
			'pages',
			'deploy',
			opts.dir,
			`--project-name=${opts.name}`,
		] )

	}

}

/**
 * Creates DOCUMENTATION instance.
 *
 * @param   {Omit<DocsParams, 'utils'>}             [args]  - Optional arguments excluding 'utils'.
 * @param   {Parameters<typeof getCommandUtils>[0]} [utils] - Optional utilities parameters.
 * @returns {Promise<DocsCore>}                             A promise that resolves to an instance of DocsCore.
 */
export const docs = async ( args?: Omit<DocsParams, 'utils'>, utils?: Parameters<typeof getCommandUtils>[0] ) => {

	const core = new DocsCore( {
		...args,
		utils : await getCommandUtils( utils ),
	} )
	return core

}

