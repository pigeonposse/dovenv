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
	resolvePath,
	isDev,
	fileURLToPath,
} from '@dovenv/core/utils'

import { setConfig }    from './merge'
import { getPkgConfig } from './pkg'

import type {
	DocsConfig,
	DocsData,
	GetConfig,
	RequiredDocsConfig,
} from './types'

export class Config {

	config      : DocsConfig | undefined
	cwd         : string
	configPath  : string | undefined
	packagePath : string
	fnPath      : string

	constructor( config?: DocsConfig, configPath?: string ) {

		this.config      = config
		this.configPath  = configPath
		this.cwd         = process.cwd()
		this.packagePath = joinPath( this.cwd, 'package.json' )
		this.fnPath      = fileURLToPath( import.meta.url )

	}

	async getPathConfig(  ): Promise<GetConfig | undefined> {

		let path = this.configPath

		if ( !path || typeof path !== 'string' ) return undefined

		path                = resolvePath( path )
		const existConfPath = await existsPath( path )
		if ( !existConfPath ) throw new Error( `A configuration route [${path}] does not exist` )

		const ext = getExtName( path )
		const dir = getDirName( path )

		if ( !( ext === '.mjs' || ext === '.js' || ext === '.json' ) ) {

			console.error( 'File type not supported. Use a .json, .mjs, or .js file.' )
			process.exit( 1 )

		}

		const { default: config } = await import( path + `?update=${Date.now()}` )

		return {
			config,
			path,
			dir,
		}

	}

	async getPackageConfig(): Promise<GetConfig | undefined> {

		const pkg = await existsPath( this.packagePath )
			? await getObjectFromJSONFile<Record<string, unknown>>( this.packagePath )
			: undefined

		if ( !pkg ) return undefined
		const config = await getPkgConfig( pkg )

		return {
			dir  : getDirName( this.packagePath ),
			path : this.packagePath,
			config,
		}

	}

	async getFnConfig( ): Promise<GetConfig | undefined> {

		if ( !this.config ) return undefined
		return {
			config : this.config,
			path   : this.fnPath,
			dir    : getDirName( this.fnPath ),
		}

	}

	async getAll(): Promise<{
		config : RequiredDocsConfig
		data   : DocsData
	}> {

		const pathConfig    = await this.getPathConfig( )
		const packageConfig = await this.getPackageConfig( )
		const fnConfig      = await this.getFnConfig( )

		const root       = this.cwd
		const devMode    = isDev()
		const mergedConf = await setConfig( {
			root,
			fnConfig      : fnConfig?.config,
			pathConfig    : pathConfig?.config,
			packageConfig : packageConfig?.config,
		} )

		const config = mergedConf.config

		const tempDir  = joinPath( root, config.out, '.temp' )
		const outDir   = joinPath( root, config.out, 'docs' )
		const cacheDir = joinPath( root, config.out, '.cache' )
		const srcDir   = devMode ? joinPath( root, config.in ) : tempDir

		return {
			config : config,
			data   : {
				devMode,
				root,
				srcDir,
				outDir,
				tempDir,
				cacheDir,
				defaultConfig : mergedConf.default,
				pathConfig,
				fnConfig,
				packageConfig,
			},
		}

	}

}
