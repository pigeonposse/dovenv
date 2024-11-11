
import {
	replaceOutputFromProcess,
	process,
	rmDeprecationAlerts,
} from '@dovenv/utils'

import { VITEPRESS_DIR } from './.vitepress/config'
import {
	getGlobals,
	globals,
	name,
	setGlobals,
	version,
	vitepressVersion,
} from './_shared/const'
import { Config } from './config/main'

import type { DocsConfig } from './main'

type DocsParams = {
	configPath? : string
	debug?      : boolean
}

/**
 * Documentation class
 *
 * For `build`, `dev` and `preview` documentation pages
 */
export class Docs {

	config : DocsConfig | undefined
	opts   : DocsParams

	constructor( conf?: DocsConfig, opts?: DocsParams ) {

		this.config = conf || undefined
		this.opts   = opts || {}

		rmDeprecationAlerts()
		replaceOutputFromProcess( {
			vitepress                : name,
			[`/.${name}`]            : `/.vitepress`,
			[`v${vitepressVersion}`] : `v${version}`,
		} )

		if ( !this.opts.debug ) console.debug = () => {}

	}

	async #runVipressCli( type: 'dev' | 'build' | 'preview',  flags?: string[] ) {

		try {

			const dovenvConfigPath = getGlobals( globals.DOVENV_CONFIG_PATH )
			const configInstance   = new Config( this.config, this.opts?.configPath  )

			if ( dovenvConfigPath ) configInstance.fnPath = dovenvConfigPath

			const config = await configInstance.getAll()

			setGlobals( globals.DOVENV_DOCS_CONFIG, config.config )
			setGlobals( globals.DOVENV_DOCS_DATA, config.data )

			const path    = VITEPRESS_DIR
			const oldArgv = process.argv

			process.argv = [
				...process.argv.slice( 0, 2 ),
				type,
				path,
				...( flags ?? [] ),
			]

			console.debug( 'docs cli argv:', process.argv )
			// @ts-ignore
			await import( 'vitepress/dist/node/cli.js' )
			process.argv = oldArgv

		}
		catch ( error ) {

			//@ts-ignore
			console.error( error.message )
			process.exit( 0 )

		}

	}

	/**
	 * __Starts the development server__.
	 *
	 * This command is a wrapper of the `npx vitepress dev` command.
	 * @param {string[]} [flags] Flags to pass to the underlying `vitepress dev`
	 * command. The `--force` flag is always passed to ensure the server starts
	 * without prompting the user.
	 */
	async dev( flags?: string[] ) {

		await this.#runVipressCli( 'dev', [ ...( flags ?? [] ), '--force' ] )

	}

	/**
	 * __Builds the documentation site__.
	 *
	 * This command is a wrapper of the `npx vitepress build` command.
	 * @param {string[]} [flags] Flags to pass to the underlying `vitepress build`
	 * command. This allows for customization and control over the build process.
	 */
	async build( flags?: string[] ) {

		await this.#runVipressCli( 'build', flags )

	}

	/**
	 * __Starts the preview server__.
	 *
	 * This command is a wrapper of the `npx vitepress preview` command.
	 * @param {string[]} [flags] Flags to pass to the underlying `vitepress preview`
	 * command. This allows for customization and control over the preview process.
	 */
	async preview( flags?: string[] ) {

		await this.#runVipressCli( 'preview', flags )

	}

}
