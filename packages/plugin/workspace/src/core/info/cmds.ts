import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class UsefulCmds extends Super implements InfoInterface {

	async get() {

		let data

		const usefulCmds = this.opts?.info?.usefulCmds ? this.opts.info.usefulCmds : undefined

		if ( !usefulCmds || !usefulCmds.length ) return
		const lastIndex = usefulCmds.length - 1

		data = ''

		for ( const [ index, cmd ] of usefulCmds.entries() ) {

			data += this.utils.style.table( [
				[ 'Command', this.utils.style.section.b( cmd.cmd ) ],
				[ 'Description', cmd.desc ],
				...( cmd.info ? [ [ 'Info', this.utils.style.section.a( cmd.info ) ] ] : [] ),
			] )

			if ( index !== lastIndex ) data += '\n\n'

		}

		return this.utils.style.box( {
			data,
			border : false,

		} )

	}

	async #fn() {

		this._title( 'Useful commands' )
		const cmds = await this.get()
		if ( cmds ) console.log( cmds )
		else console.warn( this.utils.style.warn.p( 'No commands found' ) )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
