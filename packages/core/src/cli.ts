import {
	catchError,
	color,
	createCli,
	process,
	deprecatedAlerts,
} from '@dovenv/utils'

import {
	bin,
	version,
} from '../package.json'
import { getConfig }  from './_shared/config'
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

				cli.scriptName( Object.keys( bin )[0] )
					.version( version )
					.usage( 'Usage: $0 <command> [options]' )
					.locale( 'en' )
					.help( false )
					.updateStrings( { 'Options:': 'General Options:' } )
					.showHelpOnFail( false )
					.alias( 'h', 'help' )
					.alias( 'v', 'version' )
					.option( 'config', {
						alias : 'c',
						desc  : 'Dovenv configuration file path',
						type  : 'string',

					} ).option( 'verbose', {
						desc : 'Verbose mode',
						type : 'boolean',
					} )

				const defaultCmds: CustomConfig = {
					check : {
						desc : 'Make rules from your workspaces files or directories',
						opts : { key : {
							alias : 'k',
							desc  : 'Set key patterns for check',
							type  : 'array',
						} },
						fn : async argv => {

							const instance = new Check( argv )
							await instance.run()

						},
					},
					const : {
						desc : 'Constants of your workspace',
						cmds : {
							view : { desc: 'View all constants' },
							add  : { desc: 'Add new constant' },
						},
						opts : { key : {
							alias : 'k',
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
					transform : {
						desc : 'Transform your workspaces paths\n',
						opts : { key : {
							alias : 'k',
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
				if ( ( argv.help && errorConfig ) || ( !argv._.length && errorConfig ) ) cli.showHelp( 'log' )
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

		this.#deprecatedAlerts.show()

	}

}
