import { PNG }  from 'pngjs'
import quantize from 'quantize'

import { getMediaInput } from './get'
import { MediaInput }    from './types'

/**
 * Extracts a color palette from a PNG image using pngjs.
 *
 * @param   {MediaInput}        input      - The image file path or buffer.
 * @param   {number}            colorCount - Number of colors to extract.
 * @returns {Promise<string[]>}            - Array of HEX color codes.
 */
export const getMediaPalette = async ( input: MediaInput, colorCount = 6 ): Promise<string[]> => {

	try {

		const inputBuffer = await getMediaInput( input )

		return new Promise( ( resolve, reject ) => {

			const png = new PNG()

			const processImage = ( data: Buffer ) => {

				png.parse( data, ( err, image ) => {

					if ( err ) return reject( err )

					const pixels: [number, number, number][] = []

					for ( let i = 0; i < image.data.length; i += 4 ) {

						const r     = image.data[i]
						const g     = image.data[i + 1]
						const b     = image.data[i + 2]
						const alpha = image.data[i + 3]

						if ( alpha > 0 ) pixels.push( [
							r,
							g,
							b,
						] ) // Ignore transparent pixels

					}

					const colorMap = quantize( pixels, colorCount )
					// @ts-ignore
					const palette = colorMap.palette().map( ( [
						// @ts-ignore
						r,
						// @ts-ignore
						g,
						// @ts-ignore
						b,
					] ) =>
						`#${( ( 1 << 24 ) | ( r << 16 ) | ( g << 8 ) | b ).toString( 16 ).slice( 1 )}`,
					)

					resolve( palette )

				} )

			}

			processImage( inputBuffer )

		} )

	}
	catch ( e ) {

		throw new Error( `Error getting media Palette: ${e instanceof Error ? e.message : e}` )

	}

}
