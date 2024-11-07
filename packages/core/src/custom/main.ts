/* eslint-disable @stylistic/object-curly-newline */
import {
	color,
	deepmergeCustom,
	validate,
} from '@dovenv/utils'

import { Command } from '../_shared/cmd'

import type {
	ArgvPreParsed,
	ArgvParsed,
} from '../_shared/types'
import type { Config }    from '../types'
import type { createCli } from '@dovenv/utils'

type ShowHelpFn = ( loglevel?: string ) => void
type CommandFn = (
	data: ArgvParsed & {
		/** Print the usage data using the console function consoleLevel for printing. */
		showHelp : ShowHelpFn
	} ) => Promise<void>
type Cli = Awaited<ReturnType<typeof createCli>>
type Opt = Parameters<Cli['option']>[0][number] & {
	/** Description of the option */
	desc : string
}
type SetOpts = {
	/** key of the option */
	[key in string]: Opt
}
type SetCmds = {
	/** Key of the command */
	[key in string]: Cmd
}

type Cmd = {
	/** Description of the command */
	desc      : string
	/** Options for the command if there are any */
	opts?     : SetOpts
	/** Commands for the command if there are any */
	cmds?     : SetCmds
	/** Examples of the command */
	examples? : Examples
}

type Examples = {
	/** Description of the example */
	desc : string
	/** Command to use */
	cmd  : string
}[]
export type CustomConfig = {
	/** Key of the command */
	[key in string]: Cmd & {
		/** Function to run the command */
		fn : CommandFn
	}
}
export const mergeCustomConfig = deepmergeCustom<CustomConfig>( {} )
export class Custom extends Command {

	schema = validate.record(
		validate.string(),
		validate.object( {
			desc     : validate.string(),
			opts     : validate.object( {} ).optional(),
			cmds     : validate.object( {} ).optional(),
			examples : validate.array( validate.object( {
				desc : validate.string(),
				cmd  : validate.string(),
			} ) ).optional(),
			fn : validate.function().returns( validate.promise( validate.void() ) ),
		} ).strict(  ),
	)

	props
	cli
	config

	constructor(  cli: Cli, props?: CustomConfig, config?: Config ) {

		super()
		this.props  = props
		this.cli    = cli
		this.config = config

	}

	#setCMDs( props: CustomConfig ) {

		for ( const [ key, prop ] of Object.entries( props ) ) {

			const help = ( level?: string ) => this.cli.showHelp( level || 'log' )
			// @ts-ignore
			this.cli.command( {
				command : key,
				desc    : prop.desc,
				// @ts-ignore
				builder : async argv => await this.#builder( argv, prop, help ),
				handler : async argv => await this.#handler( argv, key, prop, help ),
			} )

		}

	}

	async #builder( argv: Cli, prop: CustomConfig[number], showHelp: ShowHelpFn ) {

		if ( prop.opts ) {

			argv.group( Object.keys( prop.opts ), 'Options:' )
			argv.options( prop.opts )

		}
		if ( prop.cmds ) {

			for ( const [ key, cmd ] of Object.entries( prop.cmds ) ) {

				// @ts-ignore
				argv.command( {
					command : key,
					desc    : cmd.desc,
					builder : async argvChild => await this.#builder( argvChild, {
						...cmd,
						fn : prop.fn,
					}, showHelp ),
					handler : async argvChild => await this.#handler( argvChild, key, prop, showHelp ),
				} )

			}

		}
		if ( prop.examples )
			prop.examples.forEach( example => argv.example( example.cmd, example.desc ) )

		return argv

	}

	async #handler( argv: ArgvPreParsed, name: string, prop: CustomConfig[number], showHelp: ShowHelpFn ) {

		const {
			_: cmds,
			$0,
			...opts
		} = argv

		const time = this.performance()

		// @ts-ignore
		const title = this.config?.name || undefined
		// @ts-ignore
		const desc = this.config?.desc || undefined

		if ( title )
			console.log( `\n${color.bold.inverse( ' ' + title + ' ' )}${color.bold( desc ? '\n\n' + desc : '' )}\n` )

		this.title       = name
		this.description = prop.desc
		this.setTitle()

		try {

			await prop.fn( {
				cmds,
				opts,
				config : this.config,
				showHelp,
			} )

			this.setTime( time.prettyStop() )

		}
		catch ( e ) {

			this.log.error( e )
			this.setTime( time.prettyStop() )
			this.process.exit( 1 )

		}

	}

	async run() {

		if ( !this.props ) return

		try {

			this.validateSchema( this.props )

		}
		catch ( e ) {

			this.title       = 'custom'
			this.description = 'Custom commands'
			// set title only in case of error
			this.setTitle()
			this.log.error( e )

			return

		}
		this.validateSchema( this.props )
		this.#setCMDs( this.props )

	}

}
