import { icon } from '@fortawesome/fontawesome-svg-core'

import { svg2img } from './core'
import { image }   from '../image'

import type { IconDefinition } from '../types'

const _getSVGString = ( iconD: IconDefinition ) => {

	const res = icon( iconD ).html[0]
	return res

}

const _svgToBuffer = async ( svgData: string | IconDefinition ) => {

	return new Promise<Buffer>( ( resolve, reject ) => {

		if ( typeof svgData !== 'string' ) svgData = _getSVGString( svgData )

		svg2img( svgData, ( error, buffer ) => {

			if ( error ) {

				reject( error )

			}
			else {

				if ( !buffer ) return reject( 'Does not exist result' )

				resolve( buffer )

			}

		} )

	} )

}

/**
 * Converts a SVG string or Font Awesome icon definition to an image buffer, and displays it in the terminal.
 * @param {string | IconDefinition} svgData - SVG string or Font Awesome icon definition
 * @returns {Promise<string>} A promise that resolves to the image buffer
 */
export const svg = async ( svgData: string | IconDefinition ) => {

	const IMG = await _svgToBuffer( svgData )
	return await image( IMG )

}
