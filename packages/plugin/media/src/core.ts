import { homepage } from '../package.json'

import type { CommandUtils } from '@dovenv/core'

export class Core<Opts extends Record<string, unknown> | undefined = undefined> {

	constructor( name: string, public opts: Opts | undefined, public utils: CommandUtils ) {

		this.utils.title   = name
		this.utils.helpURL = homepage

	}

	protected async execFn( {
		desc, pattern, fn,
	}:{
		desc     : string
		pattern? : string[]
		fn       : ( v: Opts[keyof Opts] ) => Promise<void>
	} ) {

		const catchedFunction = async () => {

			const opts = this.opts
			const keys = await this.utils.getOptsKeys( {
				input : this.opts,
				pattern,
			} )
			if ( !keys || !opts ) return
			// console.log = ( ...d ) => this.utils.prompt.log.message( d.join( ' ' ) )
			for ( const key of keys ) {

				this.utils.prompt.log.info( this.utils.style.info.b( `${this.utils.style.badge( key )} ${desc}` ) )
				await fn( opts[key] as Opts[keyof Opts] )
				this.utils.prompt.log.success( this.utils.style.success.p( `${this.utils.style.success.b( key )} (${this.utils.title}) Succefully executed ✨` ) )

			}

		}

		return await this.utils.catchFn( catchedFunction() )

	}

}
