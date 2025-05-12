import { MediaInput } from './types'

import { getStringType } from '@/string'
import { readFile }      from '@/sys/super'

const _fetchImage = async ( url: string | URL ) => {

	try {

		const response = await fetch( url )

		const buffer = Buffer.from( await response.arrayBuffer() )

		return buffer

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Error fetching ghaphic from URL: ${error.message}` )

	}

}

export const getMediaInput = async ( input: MediaInput ): Promise<Buffer> => {

	if ( typeof input === 'string' ) {

		const type = getStringType( input )
		if ( type === 'url' ) return await _fetchImage( input )
		else if ( type === 'path' ) return await readFile( input )
		else return Buffer.from( input, 'utf-8' )

	}
	else if ( input instanceof URL )
		return await _fetchImage( input )
	else if ( Buffer.isBuffer( input ) ) return input

	throw new Error( `Invalid input type: ${typeof input}` )

}
