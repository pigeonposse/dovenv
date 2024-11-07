
import {
	replaceOutputFromProcess,
	process,
	rmDeprecationAlerts,
	getCurrentDir,
	joinPath,
	isDev,
} from '@dovenv/utils'

import {
	name,
	version,
	vitepressVersion,
} from './.vitepress/const'
import { setConfigGlobal } from './config/main'

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

	opts : DocsParams

	constructor( opts: DocsParams ) {

		this.opts = opts

		rmDeprecationAlerts()
		replaceOutputFromProcess( {
			vitepress                : name,
			[`v${vitepressVersion}`] : `v${version}`,
		} )

		if ( !this.opts.debug ) console.debug = () => {}

	}

	async #runVipressCli( type: 'dev' | 'build' | 'preview',  flags?: string[] ) {

		try {

			await setConfigGlobal( this.opts.configPath )
			const path = joinPath( getCurrentDir( import.meta.url ), isDev() ? '..' : '.' )

			const oldArgv = process.argv
			process.argv  = [
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
