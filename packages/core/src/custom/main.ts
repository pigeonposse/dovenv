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

type CommandFn = ( data: ArgvParsed ) => Promise<void>
type Cli = Awaited<ReturnType<typeof createCli>>
type SetOpts = Parameters<Cli['options']>[0]
type SetCmds = {
	[key in string]: {
		desc  : string
		opts? : SetOpts
	}
}

export type CustomConfig = {
	[key in string]: {
		/** Description of the command */
		desc      : string
		/** Options for the command if there are any */
		opts?     : SetOpts
		cmds?     : SetCmds
		/** Examples of the command */
		examples?: {
			/** Description of the example */
			desc : string
			/** Command to use */
			cmd  : string
		}[]
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

	async #builder( argv: Cli, prop: CustomConfig[number] ) {

		if ( prop.opts ) {

			argv.group( Object.keys( prop.opts ), 'Options:' )
			argv.options( prop.opts )

		}
		if ( prop.cmds ) {

			// argv.group( Object.keys( prop.options ), 'Subcommands:' )
			for ( const [ key, cmd ] of Object.entries( prop.cmds ) ) {

				argv.command( key, cmd.desc, async argvChild => {

					if ( cmd.opts ) argvChild.options( cmd.opts )

					return argvChild

				}, async argvChild => {

					await this.#handler( argvChild, key, prop )

				} )

			}

		}
		if ( prop.examples )
			prop.examples.forEach( example => argv.example( example.cmd, example.desc ) )

	}

	async #handler( argv: ArgvPreParsed, name: string, prop: CustomConfig[number] ) {

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

		for ( const [ key, prop ] of Object.entries( this.props ) ) {

			// @ts-ignore
			this.cli.command( {
				command : key,
				desc    : prop.desc,

				builder : async argv => await this.#builder( argv, prop ),
				handler : async argv => await this.#handler( argv, key, prop ),
			} )

		}

	}

}
