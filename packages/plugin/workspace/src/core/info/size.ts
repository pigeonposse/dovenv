
import {
	open as _open,
	getCountFromPaths,
	joinPath,
} from '@dovenv/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Size extends Super implements InfoInterface {

	async get() {

		try {

			return await getCountFromPaths( {
				input : [ joinPath( this.wsDir, '**/**' ) ],
				opts  : {
					gitignore : true,
					cwd       : this.wsDir,
				},
			} )

		}
		catch ( e ) {

			// @ts-ignore
			console.warn( 'Error getting size', e?.message )
			return

		}

	}

	async #fn(  ) {

		this._title( 'Size information' )

		const data = await this.get()
		if ( !data ) return

		this._sectionList( [
			[ 'Files', data.files ],
			[ 'Words', data.words ],
			[ 'Chars', data.chars ],
		] )

	}

	async run(  ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
