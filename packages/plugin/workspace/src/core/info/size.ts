
import {
	open as _open,
	getCountFromPaths,
	joinPath,
} from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

export class Size extends Super implements InfoInterface {

	async get() {

		try {

			return await getCountFromPaths( {
				input : [ joinPath( this.utils.wsDir, '**/**' ) ],
				opts  : {
					gitignore : true,
					cwd       : this.utils.wsDir,
				},
			} )

		}
		catch ( e ) {

			console.warn( this.utils.style.warn.msg( 'Error getting size', e instanceof Error ? e?.message : e ) )

			return

		}

	}

	async #fn( ) {

		this._title( 'Size information' )

		const data = await this.get()
		if ( !data ) return

		const res = [
			[ 'Files', data.files ],
			[ 'Words', data.words ],
			[ 'Chars', data.chars ],
		] satisfies Array<[ string, number ]>

		console.log( this.utils.style.section.ul( res ) )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
