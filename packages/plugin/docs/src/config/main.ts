/**
 * Vitepress config.
 *
 * @description Vitepress config.
 * @see https://vitepress.dev/reference/site-config
 * @see https://vitepress.dev/reference/default-theme-config
 */

import {
	existsPath,
	getExtName,
	getDirName,
	process,
	joinPath,
	getObjectFromJSONFile,
	resolvePath,
	isDev,
	fileURLToPath,
	color,
} from '@dovenv/core/utils'

import { mergeConfig }    from './_utils'
import { setConfig }      from './merge'
import { getPkgConfig }   from './pkg'
import { validateConfig } from './validate'
import {
	getGlobals,
	globals,
	setGlobals,
} from '../_shared/const'
import { DocsParams } from '../main'

import type {
	ConfigResponse,
	DocsConfig,
	GetConfig,
} from './types'

type ConfigParams = {
	configPath?       : string
	packageJsonPath?  : string
	dovenvConfigPath? : string
}
export const setConfigGlobals = ( {
	configPath, packageJsonPath,
}: ConfigParams ) => {

	setGlobals( globals.DOVENV_DOCS_CONFIG_PATH, configPath )
	setGlobals( globals.DOVENV_DOCS_PKG_PATH, packageJsonPath )

}

const getConfigGlobals = ( ): ConfigParams => {

	return {
		configPath       : getGlobals( globals.DOVENV_DOCS_CONFIG_PATH ),
		packageJsonPath  : getGlobals( globals.DOVENV_DOCS_PKG_PATH ),
		dovenvConfigPath : getGlobals( globals.DOVENV_CONFIG_PATH ),
	}

}
export class Config {

	cwd : string

	configPath       : string | undefined
	packagePath      : string
	dovenvConfigPath : string

	constructor( ) {

		const configGlobals = getConfigGlobals()

		this.cwd = process.cwd()

		this.configPath       = configGlobals.configPath
		this.packagePath      = configGlobals.packageJsonPath || joinPath( this.cwd, 'package.json' )
		this.dovenvConfigPath = configGlobals.dovenvConfigPath || fileURLToPath( import.meta.url )

		console.debug( {
			configPath       : this.configPath,
			packagePath      : this.packagePath,
			dovenvConfigPath : this.dovenvConfigPath,
		} )

	}

	async #getPathConfig( ): Promise<GetConfig | undefined> {

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

		// NOTE: `?update=${Date.now()}` is important for update the data when restart server
		const { default: config } = await import( path + `?update=${Date.now()}` )

		return {
			config,
			path,
			dir,
		}

	}

	async #getPackageConfig(): Promise<GetConfig | undefined> {

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

	async #getDovenvConfig( ): Promise<GetConfig | undefined> {

		let config: DocsConfig = {}

		if ( !this.dovenvConfigPath ) return undefined
		if ( this.dovenvConfigPath ) {

			try {

				const exists =  await existsPath( this.dovenvConfigPath )
				if ( exists ) {

					// `?update=${Date.now()}` is important for update the data when restart server
					const { default: dovenvConfig } = await import( this.dovenvConfigPath + `?update=${Date.now()}` )
					const pkg                       = dovenvConfig?.const?.pkg as Record<string, unknown> | undefined
					const dovenvDocsConfigConst     = dovenvConfig?.const?.[globals.DOVENV_DOCS_CONFIG] as DocsParams['config'] | undefined

					if ( dovenvDocsConfigConst ) {

						let dovenvDocsConfig: DocsConfig
						if ( typeof dovenvDocsConfigConst === 'function' ) {

							const utils = getGlobals( globals.DOVENV_UTILS )
							if ( !utils ) throw new Error( `Must exists global: ${globals.DOVENV_UTILS}` )
							dovenvDocsConfig = await dovenvDocsConfigConst( utils )

						}
						else dovenvDocsConfig = dovenvDocsConfigConst

						config = mergeConfig( dovenvDocsConfig, config )

					}

					if ( pkg ) {

						config = mergeConfig( await getPkgConfig( pkg ), config )

					}

				}

			}
			catch ( e ) {

				if ( e instanceof Error )
					console.warn( 'Error getting fn config "pkg" data:', e?.message )
				else console.warn( 'Error getting fn config "pkg" data:', e )

			}

		}

		if ( !config ) return undefined
		return {
			config,
			path : this.dovenvConfigPath,
			dir  : getDirName( this.dovenvConfigPath ),
		}

	}

	async #getAll(): Promise<ConfigResponse> {

		const pathConfig    = await this.#getPathConfig( )
		const packageConfig = await this.#getPackageConfig( )
		const fnConfig      = await this.#getDovenvConfig( )

		const root       = this.cwd
		const devMode    = isDev()
		const mergedConf = await setConfig( {
			root,
			fnConfig      : fnConfig?.config,
			pathConfig    : pathConfig?.config,
			packageConfig : packageConfig?.config,
		} )

		const config   = mergedConf.config
		const tempDir  = joinPath( mergedConf.outDir, '.temp' )
		const outDir   = joinPath( mergedConf.outDir, 'docs' )
		const cacheDir = joinPath( mergedConf.outDir, '.cache' )
		const srcDir   = mergedConf.srcDir

		return await validateConfig( {
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
		} )

	}

	async updateGlobals() {

		console.log( color.green( '\n✨ Update DOVENV globals\n' ) )

		const config = await this.#getAll()

		setGlobals( globals.DOVENV_DOCS_CONFIG_PATH, config.data.pathConfig?.path )
		setGlobals( globals.DOVENV_DOCS_CONFIG, config.config )
		setGlobals( globals.DOVENV_DOCS_DATA, config.data )

		console.debug( 'DOVENV_DOCS_DATA', config.data )
		console.debug( 'DOVENV_DOCS_CONFIG', config.config )

		return {
			config : config.config,
			data   : config.data,
		}

	}

}
