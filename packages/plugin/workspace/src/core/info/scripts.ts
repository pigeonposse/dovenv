import {
	getMatch,
	getObjectFromJSONFile,
	relativePath,
} from '@dovenv/core/utils'

import { Super } from '../_super/main'

import type { InfoInterface } from './_super'
import type { PackageJSON }   from '@dovenv/core/utils'

export class Scripts extends Super implements InfoInterface {

	async get( key?: string[] ) {

		let paths = await this.utils.getPkgPaths(),
			res   = ''

		if ( key && key?.length !== 0 ) paths = getMatch( paths, key )

		console.debug( {
			key,
			paths,
		} )

		if ( !paths.length ) return
		const lastIndex = paths.length - 1
		for ( const [ index, path ] of paths.entries() ) {

			const data = await getObjectFromJSONFile<PackageJSON>( path )

			const scripts = []
			if ( data.scripts ) {

				for ( const key in data.scripts ) {

					scripts.push( [ this.utils.style.section.lk( key ), this.utils.style.section.lv( data.scripts[key] || '' ) ] )

				}

			}
			const tableContent = [
				[ 'Path', this.utils.style.section.lv( relativePath( this.utils.process.cwd(), path ) ) ],
				...( scripts.length
					? [ [ '', '' ], ...scripts ]
					: [] ),
			]

			const content = this.utils.style.table( tableContent, { singleLine: true } )

			res += this.utils.style.box( {
				data   : content,
				title  : this.utils.style.section.msg( data.name || '' ),
				border : false,
			} )

			if ( lastIndex !== index ) res += '\n\n'

		}
		return this.utils.style.box( {
			data   : res,
			border : false,
		} )

	}

	async #fn( key?: string[] ) {

		this._title( 'Workspace Scripts' )

		const paths = await this.get( key )

		if ( paths ) console.log( paths )
		else {

			if ( key && key?.length !== 0 ) console.warn( this.utils.style.warn.msg( 'No packages found in workspace with patterns:', key?.join( ', ' ) ) )
			else console.warn( this.utils.style.warn.msg( 'No packages found in workspace.' ) )

		}

	}

	async run( key?: string[] ) {

		await this._envolvefn( this.#fn( key ) )

	}

}
