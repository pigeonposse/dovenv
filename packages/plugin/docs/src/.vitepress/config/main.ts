/**
 * Vitepress config.
 * @description Vitepress config.
 * @see https://vitepress.dev/reference/site-config
 * @see https://vitepress.dev/reference/default-theme-config
 */

import {
	existsPath,
	getExtName,
	getDirName,
	joinPath,
	getObjectFromJSONFile,
} from '@dovenv/utils'

import { mergeConfig } from './merge'
import {
	globals,
	setGlobals,
} from '../const'

import type { DocsConfig } from './types'

export const getConfig = async ( ) => {

	const path = globalThis[globals.DOVENV_DOCS_CONFIG_PATH]
	if ( !path || typeof path !== 'string' ) {

		console.error( 'A configuration route has not been provided.', { path } )
		process.exit( 1 )

	}
	const dir = getDirName( path )
	const ext = getExtName( path )

	if ( !( ext === '.mjs' || ext === '.js'  || ext === '.json' ) ) {

		console.error( 'File type not supported. Use a .json, .mjs or .js file.' )
		process.exit( 1 )

	}

	const { default: { ...userConfig } } = await import( path + `?update=${Date.now()}` )
	const pkgPath                        = joinPath( dir, 'package.json' )
	const exist                          = await existsPath( pkgPath )
	const pkg                            = exist ? await getObjectFromJSONFile<Record<string, unknown>>( pkgPath ) : undefined

	const mergedConf = await mergeConfig( userConfig as DocsConfig, pkg, dir )
	// console.log( {
	// 	t      : 'userConfig',
	// 	ver    : userConfig.version,
	// 	pkgVer : pkg.version,
	// 	name   : userConfig.name,
	// } )
	// console.log( {
	// 	t    : 'mergedConf',
	// 	ver  : mergedConf.config.version,
	// 	name : mergedConf.config.name,

	// } )

	setGlobals( globals.DOVENV_DOCS_CONFIG, mergedConf.config )

	if ( typeof userConfig === 'object' ) return {
		default : mergedConf.default,
		user    : mergedConf.user,
		config  : mergedConf.config,
		path,
		dir,
	}

	console.error( 'Module has bad configuration.' )
	process.exit( 1 )

}
