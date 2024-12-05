
import {
	box,
	catchError,
	color,
	existsPath,
	getObjectFromYAMLFile,
	getPaths,
	icon,
	joinPath,
	joinUrl,
	table,
} from '@dovenv/core/utils'

import { homepage } from '../../../package.json'

import type { ConstructorParams } from './types'
import type { PackageJSON }       from '@dovenv/core/utils'

export class Super {

	config : ConstructorParams['config']
	consts : ConstructorParams['consts']
	pkg    : PackageJSON
	wsDir  : string

	constructor( config?: ConstructorParams['config'], consts?: ConstructorParams['consts'] ) {

		this.config = config
		this.consts = consts

		if ( !consts?.pkg ) throw new Error( `No [pkg] const found in dovenv configuration.\n\n${this._themeInfo}` )
		if ( !consts?.workspaceDir ) throw new Error( `No [workspaceDir] const found in dovenv configuration.\n\n${this._themeInfo}` )

		this.pkg   = consts?.pkg as PackageJSON
		this.wsDir = consts?.workspaceDir as string

	}

	protected _docsUrl = homepage
	protected _pkgDocsUrl = 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json'

	protected _themeInfo = `Theme info:

	For using this theme, you need to add "pkg" and "workspaceDir" in the section "const" in your dovenv configuration.
	Also you nedd to add "engines" to your package.json and add your runtime. Example: "engines": { "node": ">=16" }.

	Read more: ${joinUrl( this._docsUrl )}`

	protected _cmdsList = {
		pnpm : {
			audit    : 'pnpm audit',
			auditFix : 'pnpm audit --fix',
			outdated : 'pnpm -r outdated',
			upDeps   : 'pnpm -r up',
			exec     : 'pnpx',
			install  : 'pnpm install',
		},
		npm : {
			audit    : 'npm audit',
			auditFix : 'npm audit fix',
			outdated : 'npm outdated',
			upDeps   : 'npm update',
			exec     : 'npx',
			install  : 'npm install',
		},
		yarn : {
			audit    : 'yarn audit',
			auditFix : 'yarn audit fix',
			outdated : 'yarn outdated',
			upDeps   : 'yarn upgrade',
			exec     : 'yarn dlx',
			install  : 'yarn install',
		},
		bun : {
			audit    : 'bun audit',
			auditFix : 'bun audit fix',
			outdated : 'bun outdated',
			upDeps   : 'bun update',
			exec     : 'bunx',
			install  : 'bun install',
		},
	}

	protected _isMonorepo() {

		return this.pkg?.workspaces ? true : false

	}

	protected _getPkgManager() {

		const pkgManager = this.pkg.packageManager

		if ( !pkgManager ) return 'npm'
		if ( pkgManager.includes( 'pnpm' ) ) return 'pnpm'
		if ( pkgManager.includes( 'yarn' ) ) return 'yarn'
		if ( pkgManager.includes( 'bun' ) ) return 'bun'
		return 'npm'

	}

	protected _getRuntime() {

		const runtime = this.pkg.engines
		const erroMsg = `No runtime found in your workspace.\nAdd "engines" to your package.json.\nRead more: ${joinUrl( this._pkgDocsUrl, '#engines' )}`

		if ( !runtime ) throw new Error( erroMsg )
		if ( runtime?.node ) return 'node'
		if ( runtime?.bun ) return 'bun'
		if ( runtime?.deno ) return 'deno'

		throw new Error( erroMsg )

	}

	protected async _getPkgPaths(  ) {

		const workspaceDir = this.wsDir

		const manager = this._getPkgManager()
		if ( manager == 'pnpm' ) {

			const monoPath = joinPath( workspaceDir, 'pnpm-workspace.yaml' )
			const exists   = await existsPath( monoPath )
			const packages = exists ? ( await getObjectFromYAMLFile<{ packages: string[] }>( monoPath ) ).packages : []
			packages.push( '.' )

			return await getPaths( packages.map( p => joinPath(  this.wsDir, p, 'package.json' ) ) )

		}
		else {

			const wsData   = this.pkg.workspaces
			const packages = ( wsData && !Array.isArray( wsData )
				? wsData.packages
				: wsData ) || []

			packages.push( '.' )
			return await getPaths(  packages.map( p => joinPath(  this.wsDir, p, 'package.json' ) ) )

		}

	}

	// #color : typeof color = color

	protected _style = {
		title        : ( v:unknown ) => color.bgMagenta( ' ' + v + ' ' ),
		sectionTitle : ( v:unknown ) => color.cyanBright( v ),
		desc         : ( v:unknown ) => color.magenta( v ),
		listKey      : ( v:unknown ) => color.magenta( icon.bullet + ' ' + v ),
		listValue    : ( v:unknown ) => color.dim.gray( v ),
		listSucced   : ( [ k, v ]:[string, unknown] ) => [ k, color.green( v ) ],
		error        : ( v:unknown ) => color.red( icon.cross + ' ' + v ),
		errorPoint   : ( v:unknown ) => color.red( icon.bullet + ' ' + v ),
		succed       : ( v:unknown ) => color.green( icon.tick + ' ' + v ),
	}

	protected _table( data: Parameters<typeof table>[0], opts?: Parameters<typeof table>[1] ) {

		return table(
			data,
			{
				drawHorizontalLine : () => false,
				drawVerticalLine   : () => false,
				...( opts || {} ),
			},
		)

	}

	protected _box( {
		data,
		title = undefined,
		border = true,
		dim = true,
	} : {
		data    : Parameters<typeof box>[0]
		title?  : string
		border? : boolean
		dim?    : boolean
	} ) {

		return box( data, {
			title,
			dimBorder : dim,
			padding   : {
				top   : 1,
				left  : 1,
				right : 1,
			},
			borderStyle : !border ? 'none' : 'single',
		} )

	}

	protected _title( title: string ) {

		console.log( this._style.title( title ) + '\n' )

	}

	protected _succedMsg( title: string ) {

		console.log( this._style.succed( title ) )

	}

	protected _sectionTitle( title: string ) {

		console.log()
		console.info( this._style.sectionTitle( title ) )

	}

	protected _sectionInfo( title: string, desc: unknown ) {

		console.log( this._style.listKey(  title + ' ' )  + this._style.listValue( desc ) )

	}

	protected _sectionList( list: ( [string, unknown] )[] ) {

		for ( const [ k, v ] of list ) this._sectionInfo( k, v )

	}

	async _envolvefn( fn: Parameters<typeof catchError>[0] ) {

		const [ error, res ] = await catchError( fn )
		if ( error ) {

			if ( error?.message )
				console.log( this._style.error( 'Workspace error\n\n' + error?.message ) )
			else console.error( error )
			return

		}
		return res

	}

}
