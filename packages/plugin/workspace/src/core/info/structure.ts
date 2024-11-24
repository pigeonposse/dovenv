
import { setDirTree } from '@dovenv/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Structure extends Super implements InfoInterface {

	async get() {

		if ( !this.config?.info?.structure ) return
		return this._box( {
			data   : setDirTree( { structure: this.config.info.structure } ),
			border : false,
		} )

	}

	async #fn() {

		this._title( 'Workspace Structure' )

		const struct = await this.get()
		if ( struct ) console.log( struct )

		console.warn( 'No structure found' )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
