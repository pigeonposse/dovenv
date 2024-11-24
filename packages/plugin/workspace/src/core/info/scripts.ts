import {
	getMatch,
	getObjectFromJSONFile,
} from '@dovenv/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'
import type { PackageJSON }   from '@dovenv/utils'

export class Scripts extends Super implements InfoInterface {

	async get( key?: string[] ) {

		let paths = await this._getPkgPaths(),
			res   = ''

		if ( key && key?.length !== 0  ) paths = getMatch( paths, key )
		if ( !paths.length ) return

		for ( const path of paths ) {

			const data = await getObjectFromJSONFile<PackageJSON>( path )

			const scripts = []
			if ( data.scripts ) {

				for ( const key in data.scripts ) {

					scripts.push( [ this._style.listKey(  key  ), this._style.listValue( data.scripts[key]  || '' ) ] )

				}

			}
			const tableContent = [
				[ 'Path', this._style.listValue( path ) ],
				...( scripts.length
					? [ [ '', '' ], ...scripts ]
					: [] ),
			]
			const content      = this._table( tableContent, { singleLine: true } )

			res += this._box(  {
				data   : content,
				title  : this._style.sectionTitle( data.name ),
				border : false,
				dim    : false,
			} )  + '\n\n'

		}
		return res

	}

	async #fn( key?: string[] ) {

		this._title( 'Workspace Scripts' )

		const paths = await this.get( key )
		if ( paths ) console.log( paths )
		console.warn( 'No packages found in workspace with patterns:', key?.join( ', ' ) || '' )

	}

	async run( key?: string[] ) {

		await this._envolvefn( this.#fn( key ) )

	}

}
