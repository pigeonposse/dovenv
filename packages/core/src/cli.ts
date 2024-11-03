import {
	createCli,
	process,
} from '@dovenv/utils'

import {
	name,
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
import type { Config }       from './types'

export const run = async ( argv: string[] ) => {

	await createCli( {
		argv : argv,
		fn   : async cli => {

			cli.scriptName( name )
				.version( version )
				.usage( 'Usage: $0 <command> [options]' )
				.locale( 'en' )
				.help( false )
				.updateStrings( { 'Options:': 'General Options:' } )
				.showHelpOnFail( false )
				.alias( 'h', 'help' )
				.alias( 'v', 'version' )
				.option( 'config', {
					alias    : 'c',
					describe : 'Configuration file path',
					type     : 'string',

				} ).option( 'verbose', {
					describe : 'Verbose mode',
					type     : 'boolean',
				} )

			const defaultCmds: CustomConfig = {
				check : {
					desc : 'Make rules from your workspaces files and directories',
					opts : { key : {
						alias    : 'k',
						describe : 'Set key patterns for check',
						type     : 'array',
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
						alias    : 'k',
						describe : 'Set key patterns of your constants for viewed',
						type     : 'array',
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
					desc : 'Transform your workspaces files and directories',
					opts : { key : {
						alias    : 'k',
						describe : 'Set key patterns of your transforms',
						type     : 'array',
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

			const config = await getConfig( argv.config && typeof argv.config === 'string' ? argv.config : undefined ) as Config
			// @ts-ignore
			process.env.DOVENV_CONFIG = config

			// @ts-ignore
			const conf   = config.custom || undefined
			const custom = new Custom(
				cli,
				conf
					? mergeCustomConfig(
						defaultCmds,
						conf,
					)
					: defaultCmds,
				// @ts-ignore
				config,
			)

			await custom.run()
			return cli

		},
	} )

}
