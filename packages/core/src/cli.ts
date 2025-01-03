import {
	catchError,
	color,
	createCli,
	process,
	deprecatedAlerts,
} from '@dovenv/utils'

import { getConfig }  from './_shared/config'
import * as CONSTS    from './_shared/const'
import { Aliases }    from './core/aliases/main'
import { Check }      from './core/check/main'
import { Constant }   from './core/const/main'
import { Transform }  from './core/transform/main'
import {
	Custom,
	mergeCustomConfig,
} from './custom/main'

import type { CustomConfig } from './custom/main'
import type {
	Config,
	Params,
} from './types'

export { CONSTS }

/**
 * Instance `Dovenv`.
 *
 * This is the "dovenv" class that builds the command line interface.
 *
 * It is similar to the cli tool but for use in `js`|`ts` projects.
 *
 * Provides tools for managing configurations, constants, and path transformations etc.
 * Supports custom configurations and predefined commands.
 * Features:
 * - Validate files or directories with custom rules.
 * - Manage workspace constants efficiently.
 * - Transform paths with configurable patterns.
 * - Extend or override default behaviors with custom configurations.
 *
 * ---
 * @see https://dovenv.pigeonposse.com/guide/core
 * @example
 * // Create an instance with custom configurations
 * const dovenv = new Dovenv({
 *   config: {
 *     check: {
 *       pkg: { include: ['src/**'], ... }
 *     },
 *   }
 * });
 *
 * // Run a predefined action
 * await dovenv.run(['check', '-k', 'pkg']);
 */
export class Dovenv {

	/**
	 * Configuration object for commands and options of the `Dovenv` instance.
	 */
	config : Params['config']

	#deprecatedAlerts = deprecatedAlerts()

	/**
	 * Contains Dovenv config path.
	 *
	 * This property is used for user information purposes only.
	 *
	 * If the "config" option is added via the class constructor, this option will be undefined.
	 * In this case you can change its value, but this may alter the behavior of the class.
	 * Do so at your own risk.
	 */
	dovenvConfigPath : string | undefined

	/**
	 * Creates a new `Dovenv` instance.
	 * @param {Params} [params] - Optional initialization parameters.
	 * @param {Params['config']} [params.config] - Configuration object for commands and options.
	 */
	constructor( params?: Params ) {

		this.config = params?.config

	}

	/**
	 * Runs the build process with the given arguments.
	 * @param {string[]} args Arguments to pass to the run process.
	 * @example
	 * const dovenv = new Dovenv({
	 *   config: {
	 *     check: {
	 *       pkg: {...}
	 *     },
	 *     ...
	 *   }
	 * })
	 * await dovenv.run(['check', '-k', 'pkg'])
	 */
	async run( args: string[] = [] ) {

		this.#deprecatedAlerts.hide()
		await createCli( {
			args,
			fn : async cli => {

				const {
					CMD,
					GLOBAL_OPTIONS,
					OPTIONS,
					BIN_NAME: name,
					VERSION,
				} = CONSTS

				cli.scriptName( name )
					.version( VERSION )
					.usage( 'Usage: $0 <command> [options]' )
					.locale( 'en' )
					.help( false )
					.updateStrings( { 'Options:': 'Global Options:' } )
					.showHelpOnFail( false )
					.alias( GLOBAL_OPTIONS.HELP.key, GLOBAL_OPTIONS.HELP.alias )
					.alias( GLOBAL_OPTIONS.VERSION.key, GLOBAL_OPTIONS.VERSION.alias )
					.option(  GLOBAL_OPTIONS.VERBOSE.key, {
						desc : 'Verbose mode',
						type : 'boolean',
					} )
					.option(  GLOBAL_OPTIONS.QUIET.key, {
						desc : 'Quiet mode',
						type : 'boolean',
					} )
					.option( GLOBAL_OPTIONS.CONFIG.key, {
						alias : GLOBAL_OPTIONS.CONFIG.alias,
						desc  : 'Dovenv configuration file path',
						type  : 'string',
					} )
					// .option( GLOBAL_OPTIONS.HELP.key, {
					// 	alias : GLOBAL_OPTIONS.HELP.alias,
					// 	desc  : 'Show help',
					// 	type  : 'boolean',
					// } )

				const defaultCmds: CustomConfig = {
					[CMD.CHECK] : {
						desc : 'Make rules from your workspaces files or directories',
						opts : { [OPTIONS.KEY.key] : {
							alias : OPTIONS.KEY.alias,
							desc  : 'Set key patterns for check',
							type  : 'array',
						} },
						fn : async argv => {

							const instance = new Check( argv )
							await instance.run()

						},
					},
					[CMD.CONSTANTS] : {
						desc : 'Constants of your workspace',
						cmds : {
							view : { desc: 'View all constants' },
							add  : { desc: 'Add new constant' },
						},
						opts : { [OPTIONS.KEY.key] : {
							alias : OPTIONS.KEY.alias,
							desc  : 'Set key patterns of your constants for viewed',
							type  : 'array',
						} },
						examples : [
							{
								desc : 'View all constants',
								cmd  : '$0 const',
							},
							{
								desc : 'View all constants less "pkg"',
								cmd  : `$0 const -k '!pkg'`,
							},
						],
						fn : async argv => {

							const instance = new Constant( argv )
							await instance.run()

						},
					},
					[CMD.TRANSFORM] : {
						desc : 'Transform your workspaces paths',
						opts : { [OPTIONS.KEY.key] : {
							alias : OPTIONS.KEY.alias,
							desc  : 'Set key patterns of your transforms',
							type  : 'array',
						} },
						examples : [
							{
								desc : 'Transform all',
								cmd  : '$0 transform',
							},
							{
								desc : 'Transforms all less "pkg"',
								cmd  : `$0 transform -k '!pkg'`,
							},
						],
						fn : async argv => {

							const instance = new Transform( argv )
							await instance.run()

						},
					},
					[CMD.ALIASES] : {
						desc : `List aliases of your config. For execute use: ${name} x\n`,
						fn   : async argv => {

							const instance = new Aliases( argv )
							await instance.run()

						},
					},
					[CMD.ALIAS_EXEC] : {
						desc     : 'Execute aliases of your config',
						settings : {
							//  @ts-ignore
							core : true,
							hide : true,
						},
						fn : async argv => {

							const instance = new Aliases( argv )
							await instance.run()

						},
					},
					[CMD.CONFIG] : {
						desc     : 'Show your config',
						settings : { hide: true },
						fn       : async ( { config } ) => {

							console.dir( config, { depth: Infinity } )

						},
					},
				}
				const argv = await cli.argv

				const [ errorConfig, configRes ] = this.config
					? [
						undefined,
						{
							config : this.config,
							path   : this.dovenvConfigPath,
						},
					]
					: await catchError( getConfig( argv.config && typeof argv.config === 'string' ? argv.config : undefined ) )

				// Show help when is not set a config file and is not set a command
				if ( ( argv[GLOBAL_OPTIONS.HELP.key] && errorConfig ) || ( !argv._.length && errorConfig ) ) cli.showHelp( 'log' )
				if ( errorConfig ) {

					console.error( '\n' + color.red( errorConfig.message ) )
					process.exit( 0 )

				}
				const config = configRes.config as Config

				// @ts-ignore
				globalThis.DOVENV_CONFIG = Object.freeze( config )
				// @ts-ignore
				globalThis.DOVENV_CONFIG_PATH = configRes.path as const

				if ( !config.const ) config.const = {}
				config.const.DOVENV_CONFIG_PATH = configRes.path as string

				const conf   = config.custom || undefined
				const custom = new Custom(
					cli,
					conf
						? mergeCustomConfig(
							// "defaultCmds" must be the first to make "\n" in the help output.
							// This means that default commands can be overridden,
							// If the user adds a custom variable with the same key as any of the default commands, it will be overridden.
							// This way the user can still change any description of the default commands or even hide them if he wants.
							// There is a risk that the user can change the behavior of the default commands, but this is not important since no command should affect the behavior of the core.
							defaultCmds,
							conf,
						)
						: defaultCmds,
					config,
				)

				await custom.run()

				if ( !argv._.length ) cli.showHelp( 'log' )

				return cli

			},
		} )

		// this.#deprecatedAlerts.show()

	}

}
