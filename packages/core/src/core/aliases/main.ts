
import {
	exec,
	validate,
} from '@dovenv/utils'

import { Command } from '../../_shared/cmd'

import type { ArgvParsed } from '../../_shared/types'

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

export class Aliases extends Command<AliasesConfig> {

	argv
	load
	id
	title = 'alias'

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

		super( argv?.config?.alias, argv?.config )

		this.id   = this.consts.CMD.ALIASES
		this.argv = argv
		this.load = this.spinner()

	}

	async #list() {

		if ( !this.opts || Object.keys( this.opts ).length === 0 ) return

		for ( const key of Object.keys( this.opts ) ) {

			const { desc } = this.opts[key]

			console.log( this.style.indent( this.style.info.li( key, desc  ) ) )

		}
		console.log( )

	}

	async #exec() {

		if ( !this.opts || Object.keys( this.opts ).length === 0 ) return

		const avaliableKeys = Object.keys( this.opts )
		const key           = avaliableKeys.find( k => this.argv?.cmds?.includes( k ) )

		if ( !key ) {

			const keyGetted = this.argv?.cmds?.at( -1 )
			console.log(
				this.style.info.h(
					keyGetted !== this.consts.CMD.ALIAS_EXEC
						? `The key provided ${this.style.badge( this.argv?.cmds?.at( -1 ) )} does not exist.\n`
						: 'No key provided.\n',
				),
				this.style.info.msg( ` Available keys:`, this.style.color.dim.italic( Object.keys( this.opts ).join( ', ' ) ) ),
			)

			return

		}

		const value = this.opts[key]
		const cmd   = value.cmd

		if ( !cmd ) return

		if ( typeof cmd === 'function' ) await cmd()
		else if ( typeof cmd === 'string' ) await exec( cmd )

	}

	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		await this.validateSchema( this.opts )

		if ( this.argv?.cmds?.includes( this.id ) ) await this.#list()
		else if ( this.argv?.cmds?.includes( this.consts.CMD.ALIAS_EXEC ) )  await this.#exec()

	}

	async run() {

		return await this.catchFn( this.#fn( ) )

	}

}
