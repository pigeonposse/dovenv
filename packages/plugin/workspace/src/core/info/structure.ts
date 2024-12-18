
import { setDirTree } from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Structure extends Super implements InfoInterface {

	async get() {

		if ( !this.opts?.info?.structure ) return

		return this.style.box( {
			data   : setDirTree( { structure: this.opts.info.structure } ),
			border : false,
		} )

	}

	async #fn() {

		this._title( 'Workspace Structure' )

		const struct = await this.get()

		if ( struct ) console.log( struct )
		else console.warn( this.style.warn.msg( 'No structure found' ) )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
