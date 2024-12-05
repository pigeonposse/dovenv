
import {
	exec,
	validate,
} from '@dovenv/utils'

import { Command } from '../_shared/cmd'

import type { ArgvParsed } from '../_shared/types'

export type AliasesConfig = {
	[key in string]: {
		/** description of your alias */
		desc : string
		/**
		 * command of your alias.
		 * @example
		 * {
		 *   cmd : 'dovenv check'
		 * }
		 * @example
		 * {
		 *   cmd : () => { console.log( 'Hello World' ) }
		 * }
		 */
		cmd  : string | ( () => Promise<void> )
	}
}

export class Aliases extends Command {

	props
	argv
	load
	id

	schema = validate.record(
		validate.string(),
		validate.object( {
			desc : validate.string(),
			cmd  : validate.string()
				.or(
					validate.function()
						.returns( validate.promise( validate.void() ) ),
				),
		} ).strict(),
	).optional()

	constructor( argv? : ArgvParsed ) {

		super()

		this.id    = this.consts.CMD.ALIASES
		this.props = argv?.config?.[this.id] || undefined
		this.argv  = argv
		this.load  = this.spinner()

	}

	async #list() {

		if ( !this.props || Object.keys( this.props ).length === 0 ) return

		for ( const key of Object.keys( this.props ) ) {

			const { desc } = this.props[key]

			this.style.setListItem( key, desc )

		}

	}

	async #exec() {

		// console.log( this.argv?.cmds )

		if ( !this.props || Object.keys( this.props ).length === 0 ) return
		const avaliableKeys = Object.keys( this.props )
		const key           = avaliableKeys.find( key => this.argv?.cmds?.includes( key ) )

		if ( !key ) {

			this.log.warn( `The key provided [${this.argv?.cmds?.at( -1 )}] does not exist. Available keys: ${Object.keys( this.props ).join( ', ' )}` )
			return

		}

		const cmd = this.props[key].cmd
		if ( cmd ) {

			if ( typeof cmd === 'function' ) await cmd()
			else if ( typeof cmd === 'string' ) await exec( cmd )

		}

	}

	async run() {

		if ( !this.props || Object.keys( this.props ).length === 0 ) {

			this.log.info( 'No aliases defined' )
			return

		}
		this.validateSchema( this.props )

		if ( this.argv?.cmds?.includes( this.id ) ) await this.#list()
		else if ( this.argv?.cmds?.includes( 'x' ) )  await this.#exec()

	}

}
