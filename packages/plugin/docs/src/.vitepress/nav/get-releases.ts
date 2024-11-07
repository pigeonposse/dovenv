/**
 * Get releases url.
 * @description Get releases url.
 */

import type { DocsConfig } from '../../config/types'

export type DownloadData = DocsConfig['download']

const setData = ( data: DownloadData['items'] ) => {

	const groupedByType: { [key: string]: {
		text : string
		link : string
	}[] } = {}
	const all: {
		text : string
		link : string
	}[]  = [ ]

	for ( const key in data ) {

		if ( Object.prototype.hasOwnProperty.call( data, key ) ) {

			const item = data[key]
			const type = item.type
			// @ts-ignore: todo
			if ( !groupedByType[type] ) groupedByType[type] = []
			if ( item.url ) {

				const value = {
					text : item.name, //item.name.replace( 'App', '' ).replace( 'extension', '' ).replace( 'Extension', '' ),
					link : item.url,
				}
				// @ts-ignore: todo
				groupedByType[type].push( value )
				all.push( value )

			}

		}

	}

	return {
		groups : groupedByType,
		all    : all,
	}

}

export const getDownloads = ( data: DownloadData ) => {

	if ( !data || !( 'items' in data ) ) return
	const {
		groups, all,
	} = setData( data.items )
	if ( !( 'groups' in data ) ) return all
	const res = []
	for ( const key in data.groups ) {

		// @ts-ignore: todo
		if ( groups[key] ) res.push( {
			text  : data.groups[key],
			items : groups[key],
		} )

	}
	return res

}
