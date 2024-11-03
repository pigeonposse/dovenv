
import {
	getCurrentDir,
	joinPath,
	resolvePath,
	replaceOutputFromProcess,
	process,
	createCli,
	existsPath,
	rmDeprecationAlerts,
} from '@dovenv/utils'

import {
	globals,
	name,
	setGlobals,
	version,
	vitepressVersion,
} from './.vitepress/const'

export type { DocsConfig } from './.vitepress/config/types'

export const run = async ( {
	argv = process.argv,
	currentDir = import.meta.url,
}: {
	argv?       : string[]
	currentDir? : string
} ) => {

	rmDeprecationAlerts()

	replaceOutputFromProcess( {
		vitepress                : name,
		[`v${vitepressVersion}`] : `v${version}`,
		// 'vitepress v1.3.4' : `${name} v${version}`,
		// '[vitepress]'      : `[${name}]`,
	} )

	const getConf = async ( configPath?: string ) => {

		try {

			let path = configPath
			// console.log( 'path', path )
			if ( !path ) throw new Error( 'A configuration route has not been provided.' )

			path        = resolvePath( path )
			const exist = await existsPath( path )
			if ( !exist ) throw new Error( `A configuration route [${path}] has not exist` )

			setGlobals( globals.DOVENV_DOCS_CONFIG_PATH, path )

			const srcPath = joinPath( getCurrentDir( currentDir ) )
			return srcPath

		}
		catch ( error ) {

			//@ts-ignore
			console.error( error.message )

			process.exit( 0 )

		}

	}

	await createCli( {
		argv,
		fn : async cli => {

			cli
				.option( 'config', {
					alias    : 'c',
					describe : 'Configuration file path',
					type     : 'string',
				} )
				.command( 'build', 'Run the build process', () => {}, async argvChild => {

					const path = await getConf( argvChild?.config )

					process.argv = [
						...process.argv.slice( 0, 2 ),
						'build',
						path,
					]

					// @ts-ignore
					await import( 'vitepress/dist/node/cli.js' )

				} )
				.command( 'dev', 'Run the dev server', () => {}, async argvChild => {

					const path = await getConf( argvChild?.config )

					process.argv = [
						...process.argv.slice( 0, 2 ),
						'dev',
						path,
						'--force',
					]

					// @ts-ignore
					await import( 'vitepress/dist/node/cli.js' )

				} )
				.command( 'preview', 'Run the preview server', () => {}, async argvChild => {

					const path = await getConf( argvChild?.config )

					process.argv = [
						...process.argv.slice( 0, 2 ),
						'preview',
						path,
					]

					// @ts-ignore
					await import( 'vitepress/dist/node/cli.js' )

				} )
				.demandCommand( 1, 'You need to specify a command (build, dev, or preview)' )

			return cli

		},
	} )

}
