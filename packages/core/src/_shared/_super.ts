import {
	process,
	logger,
	performance,
	spinner,
	getBooleanFlagValue,
	promptLine,
	promptLineGroup,
	cache,
	joinPath,
	getPaths,
	existsPath,
	getObjectFromYAMLFile,
	catchError,
	formatValidationError,
	getMatch,
	schema2type,
	zod2schema,
	getLocalPkgPath,
	exec,
} from '@dovenv/utils'

import * as consts      from './const'
import { CommandStyle } from './style'

import type { Config }          from '../types'
import type { ValidateAnyType } from '@dovenv/utils'
import type { PackageJSON }     from '@dovenv/utils'

export class CommandSuper<Opts = undefined> {

	/**
	 * App logger utils
	 * @protected
	 */
	protected log

	/**
	 * Prompt utils
	 * @protected
	 */
	protected prompt : typeof promptLine  = promptLine

	/**
	 * Sett a group of prompts with a single call
	 * @protected
	 */
	protected promptGroup : typeof promptLineGroup  = promptLineGroup

	/**
	 * Process utils
	 * @protected
	 */
	protected process = process

	/**
	 * Styles of the application
	 * @protected
	 */
	protected style  = new CommandStyle()
	protected performance  = performance
	protected spinner  = spinner

	/**
	 * The title of the application.
	 * Use in internal logs and functions.
	 *
	 */
	title = 'core'

	/**
	 * Configuration options.
	 */
	opts : Opts | undefined

	/**
	 * The dovenv configuration.
	 */
	config : Config | undefined

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * The dovenv configuration path.
	 */
	protected get configPath() {

		// @ts-ignore
		const CONF_PATH = globalThis.DOVENV_CONFIG_PATH as string

		return CONF_PATH

	}

	/** Help url for your application */
	protected helpURL = consts.HELP_URL

	/**
	 * The package.json of the workspace.
	 *
	 * getted from the dovenv configuration: `this.config.const.pkg`
	 */
	protected pkg : PackageJSON | undefined

	/**
	 * The directory of the workspace.
	 *
	 * Getted from the dovenv configuration: `this.config.const.workspaceDir` | `this.config.const.wsDir` | `process.cwd()`
	 * @protected
	 */
	protected wsDir : string = process.cwd()

	/**
	 * The messages of the application.
	 * @protected
	 */
	protected message

	/**
	 * Use this method to add debug logic.
	 * This method is called when the class is instantiated.
	 * @param {... Parameters<typeof console.debug>} args - The arguments to be passed to the console.debug method.
	 * @protected
	 */
	onDebug = ( ...args: Parameters<typeof console.debug> ) => {

		console.log( this.style.info.hr(
			this.style.info.b( 'DEBUG' ) + ( this.title && this.title.length ? ' ' +  this.title.toUpperCase()  : '' ),
			'top-center',
			true,
		) )

		for ( let i = 0; i < args.length; i++ ) {

			if ( typeof args === 'object'  ) console.dir( args, { depth: Infinity } )
			else console.log( args )

		}

		console.log( this.style.info.hr( '', 'top-center', true ) )

	}

	/**
	 * Use this method to add warn logic.
	 * This method is called when the class is instantiated.
	 * @param {... Parameters<typeof console.warn>} args - The arguments to be passed to the console.warn method.
	 * @protected
	 */
	onWarn = ( ...args: Parameters<typeof console.warn> ) => {

		console.log( this.style.warn.h1( 'WARN' ), ...args )

	}

	/**
	 * Use this method to add error logic.
	 * This method is called when the class is instantiated.
	 * @param {... Parameters<typeof console.erro>} args - The arguments to be passed to the console.error method.
	 * @protected
	 */
	onError = ( ...args: Parameters<typeof console.error> ) => {

		console.log( this.style.error.h1( 'ERROR' ), ...args )
		process.exit( 0 )

	}

	// /**
	//  * Use this method to add init logic.
	//  * This method is called when the class is instantiated.
	//  * @protected
	//  */
	// protected onInit = () => {
	// 	// nothing by default
	// }

	/**
	 * Cancel the process with the prompt line style
	 * @protected
	 */
	protected onCancel = async () => {

		this.prompt.log.step( '' )
		this.prompt.cancel( 'Process cancelled 💔' )

		process.exit( 0 )

	}

	constructor(
		opts?: Opts,
		config?: Config,
	) {

		try {

			this.log = logger
			this.log.wrapConsole()
			this.log.withTag( this.title )
			this.log.options.formatOptions = {
				columns : 80,
				colors  : false,
				compact : false,
				date    : false,
			}
			const copy                     = this.log.options.reporters
			this.log.options.reporters     = [
				{ log : ( logObj, ctx ) => {

					if ( logObj.type === 'debug' ) this.onDebug( ...logObj.args )
					else if ( logObj.type === 'warn' ) this.onWarn( ...logObj.args )
					else if ( logObj.type === 'error' ) this.onError( ...logObj.args )
					else copy[0].log( logObj, ctx )

				} },
			]

			if ( getBooleanFlagValue( consts.GLOBAL_OPTIONS.VERBOSE.key ) )
				this.log.options.level = +999

			this.opts   = opts
			this.config = config

			if ( this.config?.const?.pkg ) this.pkg = this.config.const.pkg as PackageJSON

			if ( this.config?.const?.workspaceDir && typeof this.config.const.workspaceDir === 'string' )
				this.wsDir = this.config.const.workspaceDir
			else if ( this.config?.const?.wsDir && typeof this.config.const.wsDir === 'string' )
				this.wsDir = this.config.const.wsDir

			this.message = {
				pkgError : this.style.error.code( {
					desc : `${this.style.b( 'const.pkg' )} was not found in dovenv configuration.
Add a ${this.style.b( 'const.pkg' )} variable with your workspace package.json for a better workflow with dovenv.`,
					code : `import { defineConfig } from '@dovenv/core'
import pkg from './package.json'
export default defineConfig({
  const: { pkg },
});
`,
				} ),
				noRuntime : this.style.error.code( {
					desc : `No runtime found in your workspace.
Add ${this.style.b( 'engines' )} to your package.json (${joinPath( this.wsDir, 'package.json' )}).`,
					code : `{
  "engines": {
	"node": ">=16"
  }
}`,
					lang     : 'json',
					readmore : 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json#engines',
				} ),
			}
			// console.debug( { config } )
			// this.onInit()

		}
		catch ( err ) {

			if ( err instanceof Error ) {

				const {
					message, ...e
				} = err
				console.log( this.style.error.msg( this.title, `Error\n\n${message}\n\n${e}` ) )

			}
			else
				console.error( this.style.error.p( err ) )

			process.exit( 1 )

		}

	}

	/**
	 *
	 * Use dovenv `cache` system to create a caching mechanism for storing and retrieving values of your plugin.
	 *
	 * Caches values, and returns an object with methods to interact with the cache.
	 * @param {string} id Unique identifier for the cache.
	 * @param {object} values Values to cache.
	 * @returns {object} An object with methods to interact with the cache.
	 * @protected
	 * @example
	 * const { get, set } = await command.cache( 'example-setting', {
	 *   boolean : true,
	 *   number  : 10,
	 *   string  : 'en',
	 *   array   : [
	 *     1,
	 *     2,
	 *     3,
	 *   ],
	 *   arrayMulti : [
	 *     'string',
	 *     2,
	 *     3,
	 *   ],
	 * } )
	 *
	 * const res = {
	 *   boolean    : get( 'boolean' ),
	 *   number     : get( 'number' ),
	 *   string     : get( 'string' ),
	 *   array      : get( 'array' ),
	 *   arrayMulti : get( 'arrayMulti' ),
	 * }
	 *
	 * set( {
	 *   boolean : false,
	 *   number  : 10,
	 *   string  : 'es',
	 *   array   : [
	 *     0,
	 *     1,
	 *     2,
	 *     3,
	 *   ],
	 * } )
	 *
	 * const updatedRes = get()
	 * console.log( {
	 *   initRes : res,
	 *   updatedRes,
	 * } )
	 */
	protected async cache<V extends Record<string, unknown>>( id: string, values: V ) {

		return await cache( {
			projectName : consts.BIN_NAME,
			id,
			values      : values,
		} )

	}

	/**
	 * Determines if the current package is part of a monorepo.
	 * Checks for the presence of the `workspaces` field in the package.json.
	 * @returns {boolean} True if the package is part of a monorepo, otherwise false.
	 * @protected
	 */
	protected isMonorepo() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )
		return this.pkg?.workspaces ? true : false

	}

	/**
	 * Gets the package manager name.
	 * Checks the "packageManager" property in the package.json.
	 * If it doesn't exist, returns "npm".
	 * @returns {string} The package manager name.
	 * @protected
	 */
	protected getPkgManager() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )

		const pkgManager      = this.pkg.packageManager
		const { PKG_MANAGER } = consts

		if ( pkgManager?.includes( PKG_MANAGER.PNPM ) ) return PKG_MANAGER.PNPM
		if ( pkgManager?.includes( PKG_MANAGER.YARN ) ) return PKG_MANAGER.YARN
		if ( pkgManager?.includes( PKG_MANAGER.BUN ) ) return PKG_MANAGER.BUN
		return PKG_MANAGER.NPM

	}

	protected getPkgManagerCmds(): {
		/** Audit package(s) */
		audit    : string
		/** Fix Audition package(s) */
		auditFix : string
		outdated : string
		upDeps   : string
		/** Fetches a package from the registry without installing it as a dependency, hotloads it, and runs whatever default command binary it exposes. */
		exec     : string
		/** Install packages */
		install  : string
	} {

		const manager  = this.getPkgManager()
		const monoRepo = this.isMonorepo()
		const cmds     = {
			pnpm : {
				audit    : 'pnpm audit',
				auditFix : 'pnpm audit --fix',
				outdated : monoRepo ? 'pnpm -r outdated' : 'pnpm outdated',
				upDeps   : monoRepo ? 'pnpm -r up' : 'pmpn up',
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
		return cmds[manager]

	}

	/**
	 * Determines the runtime of the current package.
	 * Checks the "engines" field in the package.json.
	 * If it doesn't exist, throws an error.
	 * @returns {string} The runtime name.
	 */
	protected getRuntime() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )

		const runtime = this.pkg.engines || this.pkg.devEngines
		const erroMsg = this.message.noRuntime

		if ( !runtime ) throw new Error( erroMsg )
		if ( runtime?.node ) return consts.RUNTIME.NODE
		if ( runtime?.bun ) return consts.RUNTIME.BUN
		if ( runtime?.deno ) return consts.RUNTIME.DENO

		throw new Error( erroMsg )

	}

	/**
	 * Gets the paths of the packages in the workspace.
	 * If the current package is part of a monorepo managed by pnpm, it reads the package paths from the "pnpm-workspace.yaml" file.
	 * Otherwise, it reads the package paths from the "workspaces" field in the package.json.
	 * @returns {Promise<string[]>} An array of paths to the package.json files of the packages in the workspace.
	 * @protected
	 */
	protected async getPkgPaths(  ) {

		if ( !this.pkg ) throw new Error( this.message.pkgError )

		const manager = this.getPkgManager()
		if ( manager == consts.PKG_MANAGER.PNPM ) {

			const monoPath = joinPath( this.wsDir, 'pnpm-workspace.yaml' )
			const exists   = await existsPath( monoPath )
			const packages = exists ? ( await getObjectFromYAMLFile<{ packages: string[] }>( monoPath ) ).packages : []
			packages.push( '.' )

			return await getPaths( packages.map( p => joinPath( this.wsDir, p, 'package.json' ) ) )

		}
		else {

			const wsData   = this.pkg?.workspaces
			const packages = ( wsData && !Array.isArray( wsData )
				? wsData.packages
				: wsData ) || []

			packages.push( '.' )
			return await getPaths(  packages.map( p => joinPath( this.wsDir, p, 'package.json' ) ) )

		}

	}

	/**
	 * Executes a binary from a local package or falls back to the package manager if it's not installed.
	 * @param {string} name - The name of the package whose binary you want to execute.
	 * @param {string[]} [args] - An optional array of arguments to pass to the binary.
	 * @returns {Promise<void>} A promise that resolves when the execution is complete.
	 * @throws {Error} If an error occurs during execution, it triggers the `onCancel` method.
	 * @example
	 * await execPkgBin('@changesets/cli', ['--help']);
	 */
	async execPkgBin( name: string, args?: string[] ) {

		const path  = getLocalPkgPath( name )
		const flags = args ? args.join( ' ' ) : ''

		if ( !path ) {

			console.warn( `"${name}" is not installed or not detected in node_modules` )

			const cmds = this.getPkgManagerCmds()
			const cmd  = `${cmds.exec} ${name} ${flags}`

			console.info( this.style.info.msg( `Execute:`, cmd ) )

			await exec( cmd )

		}
		else {

			const runtime = this.getRuntime()

			const cmd = `${runtime} ${path} ${flags}`
			await exec( cmd )

		}

	}

	/**
	 * Validate data against a schema.
	 * @param {ValidateAnyType} schema - The schema to validate with.
	 * @param {unknown} data - The data to validate.
	 * @param {object} opts - Options for function
	 * @param {boolean} [opts.showValid] - Show valid schema data. Default: false.
	 * @param {boolean} [opts.validSchema] - Set a custom valid schema
	 * @returns {unknown} The validated data.
	 * @throws If the data is invalid, an error is generated with a human-readable description.
	 */
	protected async validateSchema<D = unknown>( schema: ValidateAnyType, data: D, opts?: {
		showValid?   : boolean
		validSchema? : ValidateAnyType
	} ): Promise<D> {

		const [ error, res ] = await catchError( ( async () => schema.parse( data ) )() )

		if ( !error ) return res
		const errorFormated = formatValidationError( error )
			.replace( 'Validation error:', '' )
			.split( ';' )
			.map( value => value.trim() )
			.filter( value => value.length > 0 )
			.join( `\n` )

		let content = this.style.error.b( 'Schema error!' )
		content    += `\n\n` + this.style.error.lk( `Details:` ) + `\n\n${this.style.indent( errorFormated )}`

		if ( opts?.showValid ) {

			const type = ( await schema2type( { schema: await zod2schema( { schema: opts?.validSchema || schema } ) } ) )
			content   += `\n\n${this.style.error.lk( 'Valid schema:' )}\n\n` + this.style.indent(
				type.startsWith( '= ' ) ? type.replace( '= ', '' ) : type,
			)

		}

		throw new Error( content )

	}

	protected getKeys<K extends string[]>( props: {
		values?  : K
		pattern? : string[]
	} ): K[number][] | undefined {

		const {
			pattern,
			values = Object.keys( this.opts || [] ),
		} = props

		const keys = pattern ? pattern.map( i => String( i ) ) : values

		const userKeys = getMatch( values, keys )
		if ( userKeys.length ) return userKeys

		console.warn(
			this.style.warn.b( `keys provided does not exist` ),
			this.style.warn.text( `\nAvailable keys: ${this.style.warn.p( values.join( ', ' ) )}` ),
		)

		return undefined

	}

	/**
	 *
	 * Ensure data.
	 * @param {object} data -
	 * @param {Record<string, unknown>} data.value - Options, if passed and not empty, will return true. default: this.opts
	 * @param {string} data.name - Name to be used in the warning message.  default: this.title
	 * @returns {Promise<boolean>} - If opts is not empty, will return true, else will return false and print a warning message to the console
	 */
	protected async ensureOpts( data?: {
		value : unknown
		name  : string
	} ) {

		if ( !data ) data = {
			value : this.opts,
			name  : this.title,
		}
		if ( data.value ) return true
		console.warn( this.style.warn.p( `No options for "${this.style.b( data.name )}" found in ${consts.BIN_NAME} configuration.\nPlease add necessary configuration for correct usage.\n\n${this.configPath ? ( 'Config path: ' + this.style.color.italic( this.configPath ) + '\n' ) : ''}More info: ${this.style.a( this.helpURL )}` ) )
		return false

	}

	protected async catchFn( fn: Promise<unknown>, title?:string ) {

		const [ err, res ] = await catchError( fn )

		if ( !err ) return res
		else {

			// console.log( '\n' )
			console.log(
				this.style.error.h1( this.title ) + ( title ? ` ${this.style.error.h( title )}` : '' ),
				this.style.error.p( err.message ),

			)

		}

	}

}
