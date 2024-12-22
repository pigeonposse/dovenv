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
	color,
} from '@dovenv/core/utils'

import { mergeConfig }  from './_utils'
import { setConfig }    from './merge'
import { getPkgConfig } from './pkg'
import {
	getGlobals,
	globals,
	setGlobals,
} from '../_shared/const'

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
	isRestart

	constructor( config?: DocsConfig, configPath?: string ) {

		this.config      = config
		this.configPath  = configPath || getGlobals( globals.DOVENV_DOCS_CONFIG_PATH )
		this.cwd         = process.cwd()
		this.packagePath = joinPath( this.cwd, 'package.json' )
		this.fnPath      = getGlobals( globals.DOVENV_CONFIG_PATH ) || fileURLToPath( import.meta.url )
		this.isRestart   = false

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
		// `?update=${Date.now()}` is important for update the data when restart server
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

		if ( !this.config && !this.fnPath ) return undefined
		if ( this.fnPath ) {

			try {

				const exists =  await existsPath( this.fnPath )
				if ( exists ) {

					// `?update=${Date.now()}` is important for update the data when restart server
					const { default: dovenvConfig } = await import( this.fnPath + `?update=${Date.now()}` )
					const pkg                       = dovenvConfig?.const?.pkg as Record<string, unknown> | undefined
					const dovenvDocsConfig          = dovenvConfig?.const?.[globals.DOVENV_DOCS_CONFIG] as DocsConfig | undefined
					if ( dovenvDocsConfig ) {

						this.config = mergeConfig( dovenvDocsConfig, this.config || {} )

					}
					if ( pkg ) {

						const config = await getPkgConfig( pkg )
						this.config  = mergeConfig( config, this.config || {} )

					}

				}

			}
			catch ( e ) {

				if ( e instanceof Error )
					console.warn( 'Error getting fn config "pkg" data', e?.message )
				else console.warn( 'Error getting fn config "pkg" data', e )

			}

		}

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

		const tempDir  = joinPath( root, config.output, '.temp' )
		const outDir   = joinPath( root, config.output, 'docs' )
		const cacheDir = joinPath( root, config.output, '.cache' )
		const srcDir   = joinPath( root, config.input )

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

	async setGlobals() {

		const config = await this.getAll()

		setGlobals( globals.DOVENV_DOCS_CONFIG_PATH, config.data.pathConfig?.path )
		setGlobals( globals.DOVENV_DOCS_CONFIG, config.config )
		setGlobals( globals.DOVENV_DOCS_DATA, config.data )

	}

	async updateGlobals() {

		console.log( color.green( '\n✨ Update DOVENV globals\n' ) )
		// const fnConfig = await this.getFnConfig( )
		// console.log( fnConfig, this.fnPath, this.configPath, this.cwd, this.packagePath )
		await this.setGlobals()

	}

}
