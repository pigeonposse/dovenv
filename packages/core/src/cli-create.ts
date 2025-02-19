import {
	createCli as createCliCore,
	hideBin,
} from '@dovenv/utils'

import * as CONSTS         from './_shared/const'
import { Response }        from './_shared/types'
import { Custom }          from './custom/main'
import { CustomConfig }    from './custom/types'
import { getCommandUtils } from './main'

type Cli = Parameters<Parameters<typeof createCliCore>[0]['fn']>[0]
type Argv = Awaited<Cli['argv']>
type CreateCliContructorParams =  {
	/** CLI name */
	name?     : string
	/** CLI version */
	version?  : string
	/** CLI arguments */
	args?     : string[]
	/** CLI global options */
	opts?     : CustomConfig[number]['opts']
	/** CLI examples */
	examples? : CustomConfig[number]['examples']
	/**
	 * CLI Hook.
	 *
	 * `yargs` parser
	 */
	hook?     : <C extends Cli>( data: {
		cli  : C
		argv : Argv
	} ) => Response<C>
}

// eslint-disable-next-line @stylistic/object-curly-newline
type CreateCliParams = CreateCliContructorParams & NonNullable<Parameters<typeof getCommandUtils>[0]> & {
	/** CLI commands */
	cmds? : CustomConfig }

export const _createCliConstructor = async ( opts?: CreateCliContructorParams ) => {

	const {
		GLOBAL_OPTIONS,
		BIN_NAME,
		VERSION,
	} = CONSTS

	const {
		args = [],
		version = VERSION,
		name = BIN_NAME,
		opts: globalOpt,
		hook,
		examples,
	} = opts || {}

	return await createCliCore( {
		args,
		fn : async cli => {

			cli.scriptName( name )
				.version( version )
				.usage( 'Usage: $0 <command> [options]' )
				.locale( 'en' )
				.help( false )
				.updateStrings( { 'Options:': 'Global Options:' } )
				.showHelpOnFail( false )
				.wrap( cli.terminalWidth() )
				.alias( GLOBAL_OPTIONS.HELP.key, GLOBAL_OPTIONS.HELP.alias )
				.alias( GLOBAL_OPTIONS.VERSION.key, GLOBAL_OPTIONS.VERSION.alias )
				.option( GLOBAL_OPTIONS.VERBOSE.key, {
					desc : 'Verbose mode',
					type : 'boolean',
				} )
				.option( GLOBAL_OPTIONS.QUIET.key, {
					desc : 'Quiet mode',
					type : 'boolean',
				} )

			if ( globalOpt ) cli.options( globalOpt )
			if ( examples ) examples.forEach( d => cli.example( d.cmd, d.desc ) )

			const argv = await cli.argv

			if ( hook ) cli = await hook( {
				cli,
				argv,
			} )

			if ( !argv._.length ) cli.showHelp( 'log' )

			return cli

		},
	} )

}

export const createCLI = async ( opts?: CreateCliParams ) => {

	const {
		wsDir,
		pkg,
		cmds,
		hook,
		...rest
	} = opts || {}

	const utils = await getCommandUtils( {
		wsDir,
		pkg,
	} )

	if ( !rest.args ) rest.args = hideBin( utils.process.argv )

	return await _createCliConstructor( {
		...rest,
		hook : async ( {
			cli, argv,
		} ) => {

			if ( cmds ) {

				const custom = new Custom(
					cli,
					cmds,
					utils,
				)

				await custom.run()

			}

			if ( hook ) cli = await hook( {
				cli,
				argv,
			} )
			return cli

		},
	} )

}
