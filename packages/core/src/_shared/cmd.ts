/* eslint-disable jsdoc/check-tag-names */
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
	catchError,
	formatValidationError,
	getMatch,
	schema2type,
	zod2schema,
	getLocalPkgPath,
	exec,
	validate,
	getPackageManagerFromContent,
	getPackageRuntimeFromContent,
	getPackageWorkspacePaths,
	getPackageDataFromPath,
	getBaseName,
} from '@dovenv/utils'

import * as consts      from './const'
import { CommandStyle } from './style'
import { ConstValue }   from '../core/const/types'

import type { Config } from '../types'
import type {
	PackageData,
	PackageManagerData,
	RuntimeData,
	ValidateAnyType,
} from '@dovenv/utils'
import type { PackageJSON } from '@dovenv/utils'

type ConfigConst = NonNullable<NonNullable<CommandSuper['config']>['const']>

/**
 * Class for setting up Dovenv command utilities.
 *
 * @example
 * const utils = new CommandSuper({ const: { pkg: myPackage, wsDir: '/workspace' } });
 * console.log(utils);
 */
export class CommandSuper {

	/**
	 * Logger utils.
	 */
	log

	/**
	 * Validate utils (zod wraper).
	 */
	validate : typeof validate = validate

	/**
	 * Prompt utils.
	 */
	prompt : typeof promptLine = promptLine

	/**
	 * Sett a group of prompts with a single call.
	 */
	promptGroup : typeof promptLineGroup = promptLineGroup

	/**
	 * Process utils ('node:process' wrapper).
	 */
	process = process

	/**
	 * Styles of the application.
	 */
	style = new CommandStyle()

	/**
	 * Set performance.
	 */
	performance = performance

	/**
	 * Create spinner.
	 */
	spinner = spinner

	/**
	 * The title of the command.
	 * Use in internal logs and functions.
	 *
	 */
	title = 'core'

	/**
	 * The dovenv configuration.
	 */
	config : Config | undefined

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * The dovenv configuration path.
	 */
	get configPath() {

		// @ts-ignore
		const CONF_PATH = globalThis.DOVENV_CONFIG_PATH as string

		return CONF_PATH

	}

	/**
	 * Dovenv version.
	 *
	 */
	version = consts.VERSION

	/**
	 * Help url for your command.
	 */
	helpURL = consts.HELP_URL

	/**
	 * The package.json of the workspace.
	 *
	 * Getted from the dovenv configuration: `this.config.const.pkg`.
	 */
	pkg : PackageJSON | undefined

	/**
	 * The directory of the workspace.
	 *
	 * Getted from the dovenv configuration: `this.config.const.workspaceDir` | `this.config.const.wsDir` | `process.cwd()`.
	 */
	wsDir : string = process.cwd()

	/**
	 * The messages of the application.
	 *
	 * @protected
	 */
	protected message

	/**
	 * Use this method to add debug logic.
	 * This method is called when the class is instantiated.
	 *
	 * @param {... Parameters<typeof console.debug>} args - The arguments to be passed to the console.debug method.
	 */
	onDebug = ( ...args: Parameters<typeof console.debug> ) => {

		console.log( this.style.info.hr(
			this.style.info.b( 'DEBUG' ) + ( this.title && this.title.length ? ' ' + this.title.toUpperCase() : '' ),
			'top-center',
			true,
		) )

		for ( let i = 0; i < args.length; i++ ) {

			if ( typeof args === 'object' ) console.dir( args, { depth: Infinity } )
			else console.log( args )

		}

		console.log( this.style.info.hr( '', 'top-center', true ) )

	}

	/**
	 * Use this method to add warn logic.
	 * This method is called when the class is instantiated.
	 *
	 * @param {... Parameters<typeof console.warn>} args - The arguments to be passed to the console.warn method.
	 */
	onWarn = ( ...args: Parameters<typeof console.warn> ) => {

		console.log( this.style.warn.h1( 'WARN' ), ...args )

	}

	/**
	 * Use this method to add error logic.
	 * This method is called when the class is instantiated.
	 *
	 * @param {... Parameters<typeof console.erro>} args - The arguments to be passed to the console.error method.
	 */
	onError = ( ...args: Parameters<typeof console.error> ) => {

		if ( args && args.length ) console.log( this.style.error.h1( 'ERROR' ), ...args )
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
	 * Cancel the process with the prompt line style.
	 */
	onCancel = async () => {

		this.prompt.log.step( '' )
		this.prompt.cancel( 'Process cancelled 💔' )

		process.exit( 0 )

	}

	constructor(
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
	 *
	 * @param   {string} id     - Unique identifier for the cache.
	 * @param   {object} values - Values to cache.
	 * @returns {object}        An object with methods to interact with the cache.
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
	async cache<V extends Record<string, unknown>>( id: string, values: V ): ReturnType<typeof cache<V>> {

		return await cache<V>( {
			projectName : this.pkg?.name || getBaseName( this.wsDir ) || 'shared',
			suffix      : consts.BIN_NAME,
			id,
			values      : values,
		} )

	}

	#pkgManager : PackageManagerData | undefined
	#runtime    : RuntimeData | undefined
	#pkgPaths   : string[] | undefined
	#pkgData    : PackageData[] | undefined

	get monorepo() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )
		return !!this.pkg?.workspaces

	}

	get runtime() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )
		if ( this.#runtime ) return this.#runtime
		this.#runtime = getPackageRuntimeFromContent( this.pkg )

		return this.#runtime

	}

	get packageManager() {

		if ( !this.pkg ) throw new Error( this.message.pkgError )
		if ( this.#pkgManager ) return this.#pkgManager
		this.#pkgManager = getPackageManagerFromContent( this.pkg )

		return this.#pkgManager

	}

	/**
	 * Determines if the current package is part of a monorepo.
	 * Checks for the presence of the `workspaces` field in the package.json.
	 *
	 * @returns {boolean} True if the package is part of a monorepo, otherwise false.
	 * @deprecated
	 */
	isMonorepo(): boolean {

		return this.monorepo

	}

	/**
	 * Gets the package manager name.
	 * Checks the "packageManager" property in the package.json.
	 * If it doesn't exist, returns "npm".
	 *
	 * @returns {string} The package manager name.
	 * @deprecated
	 */
	getPkgManager() {

		return this.packageManager.value

	}

	/**
	 * Retrieves the command mappings for the detected package manager.
	 *
	 * The returned object contains commands for various package management tasks,
	 * such as auditing, updating, installing, and executing packages.
	 *
	 * @returns {object} An object containing package manager commands.
	 * @deprecated
	 */
	getPkgManagerCmds() {

		return this.packageManager.cmds

	}

	/**
	 * Determines the runtime of the current package.
	 * Checks the "engines" field in the package.json.
	 * If it doesn't exist, throws an error.
	 *
	 * @returns {string} The runtime name.
	 * @deprecated
	 */
	getRuntime() {

		return this.runtime.value

	}

	/**
	 * Gets the paths of the packages in the workspace.
	 * If the current package is part of a monorepo managed by pnpm, it reads the package paths from the "pnpm-workspace.yaml" file.
	 * Otherwise, it reads the package paths from the "workspaces" field in the package.json.
	 *
	 * @returns {Promise<string[]>} An array of paths to the package.json files of the packages in the workspace.
	 */
	async getPkgPaths( ) {

		if ( !this.pkg ) throw new Error( this.message.pkgError )
		if ( this.#pkgPaths ) return this.#pkgPaths

		this.#pkgPaths = await getPackageWorkspacePaths( {
			wsDir   : this.wsDir,
			pkg     : this.pkg,
			manager : this.packageManager.value,
		} )
		return this.#pkgPaths

	}

	/**
	 * Retrieves an array of package data objects containing the package name, path to the package.json file, and the package data itself.
	 *
	 * @returns {Promise<object[]>} An array of package data objects.
	 */
	async getPkgsData() {

		if ( this.#pkgData ) return this.#pkgData

		const pkgPaths = await this.getPkgPaths()

		this.#pkgData = []

		for ( const pkgPath of pkgPaths ) {

			const data = await getPackageDataFromPath( pkgPath )

			this.#pkgData.push( data )

		}
		return this.#pkgData

	}

	/**
	 * Resolves and normalizes file paths based on the provided input and options.
	 * Ensures that all returned paths are absolute and within the workspace directory.
	 *
	 * @param   {string[]}                                    input  - An array of file or directory paths to process.
	 * @param   {Omit<Parameters<typeof getPaths>[1], 'cwd'>} [opts] - Optional configuration for path resolution,
	 *                                                               excluding the `cwd` property, which is automatically set to the workspace directory.
	 * @returns {Promise<string[]>}                                  - A promise that resolves to an array of normalized absolute paths.
	 */
	async getPaths( input: string[], opts: Omit<Parameters<typeof getPaths>[1], 'cwd'> = {} ) {

		return ( await getPaths( input, {
			...opts,
			cwd : this.wsDir,
		} ) ).map( p => this.getWsPath( p ) )

	}

	/**
	 * Gets the absolute workspace path.
	 *
	 * If the given path is not inside the workspace directory, it prepends the workspace directory path.
	 *
	 * @param   {string} path - The relative or absolute path.
	 * @returns {string}      The resolved workspace path.
	 */
	getWsPath( path: string ) {

		if ( !path ) path = ''

		return path.startsWith( this.wsDir ) ? path : joinPath( this.wsDir, path )

	}

	/**
	 * Executes a binary from a local package or falls back to the package manager if it's not installed.
	 *
	 * @param   {string}        name               - The name of the package whose binary you want to execute.
	 * @param   {string[]}      [args]             - An optional array of arguments to pass to the binary.
	 * @param   {object}        opts               - Options-.
	 * @param   {string}        opts.path          - Custom path.
	 * @param   {boolean}       opts.forceExec     - Force execution with current runtime and not check if exists in 'node_modules'.
	 * @param   {string}        opts.remoteVersion - Set version of the package. Only is used when package is not in local enviroment.
	 * @returns {Promise<void>}                    A promise that resolves when the execution is complete.
	 * @throws {Error} If an error occurs during execution, it triggers the `onCancel` method.
	 * @example
	 * await execPkgBin('@changesets/cli', ['--help']);
	 */
	async execPkgBin( name: string, args?: string[], opts?:{
		/**
		 * Custom path from package root.
		 * Only affects when name no exists in node_modules.
		 *
		 * @experimental
		 */
		path?          : string
		/**
		 * Force execution with current package manager and not check if exists in 'node_modules'.
		 *
		 * @default false
		 */
		forceExec?     : boolean
		/**
		 * Set version of the package.
		 * Only is used when package is not in local enviroment.
		 */
		remoteVersion? : string
	} ) {

		console.debug( {
			name,
			args,
			opts,
		} )

		let path    = getLocalPkgPath( name )
		const flags = args ? args.join( ' ' ) : ''

		if ( !path || opts?.forceExec ) {

			if ( !opts?.forceExec )
				console.info( `"${name}" is not installed or not detected in "node_modules"` )

			const cmds = this.packageManager.cmds
			const cmd  = `${cmds.exec} ${name}@${opts?.remoteVersion || 'latest'} ${flags}`

			console.info( this.style.info.msg( `Execute:`, cmd ), '\n' )

			await exec( cmd )

		}
		else {

			const runtime = this.getRuntime()

			if ( opts?.path ) {

				const index = path.lastIndexOf( name )

				if ( index !== -1 ) path = path.slice( 0, index + name.length )
				path = joinPath( path, opts?.path )

			}

			const cmd = `${runtime} ${path} ${flags}`
			console.info( this.style.info.msg( `Execute:`, cmd ) )
			await exec( cmd )

		}

	}

	/**
	 * Validate data against a schema.
	 *
	 * @param   {ValidateAnyType} schema             - The schema to validate with.
	 * @param   {unknown}         data               - The data to validate.
	 * @param   {object}          opts               - Options for function.
	 * @param   {boolean}         [opts.showValid]   - Show valid schema data on Error. Default: false.
	 * @param   {boolean}         [opts.validSchema] - Set a custom valid schema
	 * @returns {unknown}                            The validated data.
	 * @throws If the data is invalid, an error is generated with a human-readable description.
	 */
	async validateSchema<D = unknown>( schema: ValidateAnyType, data: D, opts?: {
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

	/**
	 * Retrieves matching keys from a given list of values based on a pattern.
	 *
	 * @template                           K               - An array of string keys.
	 * @param    {object}                  props           - The function parameters.
	 * @param    {K}                       props.input     - The list of available keys.
	 * @param    {string[]}                [props.pattern] - An optional pattern to filter the keys.
	 * @returns  {K[number][] | undefined}                 The matched keys, or `undefined` if no matches are found.
	 */
	getKeys<K extends string[]>( props: {
		input    : K
		pattern? : string[]
	} ): K[number][] | undefined {

		const {
			pattern,
			input,
		} = props

		const keys = pattern ? pattern.map( i => String( i ) ) : input

		const userKeys = getMatch( input, keys )
		if ( userKeys.length ) return userKeys

		console.warn(
			this.style.warn.b( `keys provided does not exist` ),
			this.style.warn.text( `\nAvailable keys: ${this.style.warn.p( input.join( ', ' ) )}` ),
		)

		return undefined

	}

	getKey<K extends string[], V extends string>( props: {
		input  : K
		value? : V
	} ): V | undefined {

		const {
			value,
			input,
		} = props

		if ( ( value && input.includes( value ) ) ) return value

		console.warn(
			this.style.warn.b( `key provided does not exist` ),
			this.style.warn.text( `\nAvailable keys: ${this.style.warn.p( input.join( ', ' ) )}` ),
		)

		return undefined

	}

	/**
	 *
	 * Ensure data.
	 *
	 * @param   {object}                  data       -.
	 * @param   {Record<string, unknown>} data.input - Options, if passed and not empty, will return true.
	 * @param   {string}                  data.name  - Name to be used in the warning message.  Default: this.title.
	 * @returns {Promise<boolean>}                   - If opts is not empty, will return true, else will return false and print a warning message to the console.
	 */
	async ensureOpts<V extends Record<string, unknown> | undefined>( data: {
		input : V
		name? : string
	} ) {

		if ( !data.name ) data.name = this.title

		if ( data.input ) return true
		console.warn( this.style.warn.p( `No options for "${this.style.b( data.name )}" found in ${consts.BIN_NAME} configuration.\nPlease add necessary configuration for correct usage.\n\n${this.configPath ? ( 'Config path: ' + this.style.color.italic( this.configPath ) + '\n' ) : ''}More info: ${this.style.a( this.helpURL )}` ) )
		return false

	}

	async getOptsKeys<
		V extends Record<string, unknown> | undefined,
		P extends string | string[] | undefined,
	>( data: {
		input   : V
		pattern : P
		name?   : string
	} ): Promise<( P extends string[]
		? ( string[] | undefined )
		: P extends string
			? ( string | undefined )
			: undefined
			) | undefined
	> {

		if ( !data.name ) data.name = this.title

		if ( !( data.input && Object.keys( data.input ).length ) ) {

			console.warn( this.style.warn.p( `No options for "${this.style.b( data.name )}" found in ${consts.BIN_NAME} configuration.\nPlease add necessary configuration for correct usage.\n\n${this.configPath ? ( 'Config path: ' + this.style.color.italic( this.configPath ) + '\n' ) : ''}More info: ${this.style.a( this.helpURL )}` ) )
			return undefined

		}

		const input = Object.keys( data.input )
		// @ts-ignore
		if ( data.pattern && Array.isArray( data.pattern ) ) return this.getKeys( {
			input,
			pattern : data.pattern,
		} ) as ( string[] | undefined )
		// @ts-ignore
		else if ( typeof data.pattern === 'string' ) return this.getKey( {
			input,
			value : data.pattern,
		} ) as ( string | undefined )

		console.warn(
			this.style.warn.b( `Any key provided` ),
			this.style.warn.text( `\nAvailable keys: ${this.style.warn.p( input.join( ', ' ) )}` ),
		)
		return

	}

	async getConsts<K extends keyof ConfigConst | undefined>( key?: K ):
	Promise<
		K extends keyof ConfigConst
			? ConstValue
			: Record<keyof ConfigConst, ConstValue>
	> {

		const values   = this.config?.const || {}
		const getConst = async ( key:string ) => {

			if ( !( values && typeof key === 'string' && key in values ) ) return

			const value = values[key]

			if ( typeof value === 'function' ) {

				const [ e, result ] = await catchError( ( async () => await value() )() )

				if ( !e ) return result
				return 'Error setting value of ' + key + ':\n' + e.message

			}
			else return value

		}
		// @ts-ignore
		if ( key ) return await getConst( key ) as ConstValue | undefined

		return Object.fromEntries(
			await Promise.all(
				Object.entries( values ).map( async ( [ key ] ) => {

					return [ key, getConst( key ) ]

				} ),
			),
		) as Record<keyof ConfigConst, ConstValue>

	}

	/**
	 * Exits the process with a status code of 1, indicating an error.
	 */
	exitWithError() {

		// this.process.exitCode = 1
		this.process.exit( 1 )

	}

	logGroup( k?:string ) {

		const logConstructor = ( type: 'info' | 'success' | 'warn' | 'error', key?: string ) =>
			( t: string, m?: string ) => this.prompt.log[type](
				this.style.info.badge( this.title ) + ( key ? this.style[type].b( ` (${key}) ` ) : ' ' ) + ( !m
					? this.style[type].p( t )
					: this.style[type].msg( t, m )
				),
			)
		return {
			info    : logConstructor( 'info', k ),
			success : logConstructor( 'success', k ),
			warn    : logConstructor( 'warn', k ),
			error   : logConstructor( 'error', k ),
			step    : ( m?:string ) => this.prompt.log.step( m || '' ),
		}

	}

	/**
	 * Executes a callback function in parallel for each key-value pair in the input object
	 * that matches a specified pattern.
	 *
	 * @template                                V            - A record type representing the input object's key-value pairs.
	 * @template                                P            - A string or array of strings used as a pattern to filter the keys.
	 * @template                                R            - The type of the result returned by the callback function.
	 * @param    {object}                       opts         - The options object.
	 * @param    {V}                            opts.input   - The input object containing key-value pairs to process.
	 * @param    {P}                            opts.pattern - An optional pattern to filter the keys to be processed.
	 * @param    {Function}                     opts.cb      - A callback function executed for each matching key-value pair.
	 *                                                       The callback receives an object containing the key, value, and a logger.
	 * @returns  {Promise<{[K in keyof V]: R}>}              A promise that resolves to an object containing the results
	 *                                                       of the callback execution for each key.
	 */

	async mapOpts<
		V extends Record<string, unknown>,
		P extends string | string[] | undefined,
		R,
	>( opts: {
		input?   : V
		pattern? : P
		/**
		 * A callback function executed for each matching key-value pair.
		 */
		cb      : ( <K extends keyof V>( opts: {
			key   : K
			value : V[K]
			/**
			 * Logger
			 */
			log   : ReturnType<CommandSuper['logGroup']>
		} ) => Promise<R> )
	} ) {

		const {
			input, pattern, cb,
		} = opts

		const keys = ( await this.getOptsKeys( {
			input,
			pattern,
		} ) as ( keyof V )[] ) ?? []

		if ( !input ) return {}

		const results = await Promise.all( keys.map( async key => {

			const log = this.logGroup( String( key ) )

			log.info( '🏁', 'Starting...' )
			const result = await cb( {
				key,
				value : input[key],
				log,
			} )
			log.success( '✨', 'Finished Successfully\n' )

			return [ key, result ] as [keyof V, R]

		} ) )
		return Object.fromEntries( results ) as { [K in keyof V]?: R }

	}

	/**
	 * Catch Promise function.
	 *
	 * If error print in console and exit from process.
	 *
	 * @template              T       - The expected return type.
	 * @param    {Promise<T>} fn      - The Promise to handle.
	 * @param    {string}     [title] - Optional title for the error output.
	 * @returns  {Promise<T>}         The resolved value of the Promise.
	 */
	async catchFn<Res>( fn: Promise<Res>, title?:string ) {

		const [ err, res ] = await catchError( fn )

		if ( !err ) return res
		else {

			console.log(
				this.style.error.h1( this.title ) + ( title ? ` ${this.style.error.h( title )}` : '' ),
				this.style.error.p( err.message ),
			)

			this.exitWithError()

		}

	}

}
