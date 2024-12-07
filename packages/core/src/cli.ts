import {
	catchError,
	color,
	createCli,
	process,
	deprecatedAlerts,
} from '@dovenv/utils'

import { getConfig }  from './_shared/config'
import * as CONSTS    from './_shared/const'
import { Aliases }    from './aliases/main'
import { Check }      from './check/main'
import { Constant }   from './const/main'
import {
	Custom,
	mergeCustomConfig,
} from './custom/main'
import { Transform } from './transform/main'

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
					[CMD.ALIASES] : {
						desc : `List aliases of your config. For execute use: ${name} x`,
						fn   : async argv => {

							const instance = new Aliases( argv )
							await instance.run()

						},
					},
					[CMD.ALIAS_EXEC] : {
						desc     : 'Execute aliases of your config',
						settings : { hide: true },
						fn       : async argv => {

							const instance = new Aliases( argv )
							await instance.run()

						},
					},
					[CMD.TRANSFORM] : {
						desc : 'Transform your workspaces paths\n',
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

							const constInstance = new Constant( argv )
							const instance      = new Transform( argv, constInstance )
							await instance.run()

						},
					},
				}
				const argv = await cli.argv

				const [ errorConfig, configRes ] = this.config
					? [
						undefined,
						{
							config : this.config,
							path   : undefined,
						},
					]
					: await catchError( getConfig( argv.config && typeof argv.config === 'string' ? argv.config : undefined ) )

				// Show help when is not set a config file and is not set a command
				if ( ( argv[GLOBAL_OPTIONS.HELP.key] && errorConfig ) || ( !argv._.length && errorConfig ) ) cli.showHelp( 'log' )
				if ( errorConfig ) {

					console.error( '\n\n' + color.red( errorConfig.message ) )
					process.exit( 0 )

				}
				const config = configRes.config as Config

				// @ts-ignore
				globalThis.DOVENV_CONFIG = Object.freeze( config )
				// @ts-ignore
				globalThis.DOVENV_CONFIG_PATH = configRes.path as const

				const conf   = config.custom || undefined
				const custom = new Custom(
					cli,
					conf
						? mergeCustomConfig(
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
