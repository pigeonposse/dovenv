/* eslint-disable camelcase */
/**
 * Inspired from `asciify-image` library.
 * Is the same as the `asciify` but with modern code and no dependencies.
 * @see https://github.com/ajay-gandhi/asciify-image/
 */

import {
	getStringType,
	color as Couleurs,
	getPlatform,
	readFile,
}     from '@dovenv/utils'
import Jimp       from 'jimp-compact' // 1.3MB @see https://pkg-size.dev/jimp-compact
import { Buffer } from 'node:buffer'

import type { AsciifyOptions } from './types'

// Set of basic characters ordered by increasing "darkness"
// Used as pixels in the ASCII image

const fg = ( text: string, r: number, g: number, b: number ): string => {

	return Couleurs.rgb( r, g, b )( text )

}

const getTerminalSize = (): {
	width  : number
	height : number
} => {

	return {
		width  : process.stdout.columns || 80, // Ancho predeterminado en caso de no estar disponible
		height : process.stdout.rows || 24,  // Alto predeterminado en caso de no estar disponible
	}

}

type CalculateDimsOpts = Required<Pick<AsciifyOptions, 'fit'>> & {
	width  : number
	height : number
}
const calculateDims = (
	img: Jimp,
	opts: CalculateDimsOpts,
): [number, number] => {

	if ( opts.fit === 'width' )
		return [ opts.width, img.bitmap.height * ( opts.width / img.bitmap.width ) ]
	else if ( opts.fit === 'height' )
		return [ img.bitmap.width * ( opts.height / img.bitmap.height ), opts.height ]
	else if ( opts.fit === 'none' ) return [ opts.width, opts.height ]
	else if ( opts.fit === 'box' ) {

		const wRatio = img.bitmap.width / opts.width
		const hRatio = img.bitmap.height / opts.height
		return wRatio > hRatio
			? [ opts.width, Math.round( img.bitmap.height / wRatio ) ]
			: [ Math.round( img.bitmap.width / hRatio ), opts.height ]

	}
	else {

		if ( opts.fit !== 'original' )
			console.error( 'Invalid option "fit", assuming "original"' )

		return [ img.bitmap.width, img.bitmap.height ]

	}

}

const _fetchImage = async ( url: string ) => {

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

const intensity = ( img: Jimp, x: number, y: number ): number => {

	const color = Jimp.intToRGBA( img.getPixelColor( x, y ) )
	return color.r + color.g + color.b + color.a

}

export const asciifyImg = async ( opts: AsciifyOptions ): Promise<string> => {

	try {

		const terminalCharWidth = await getPlatform() === 'windows' ? 0.714 : 0.5
		const image             = await Jimp.read( opts.input )

		const windowSize    = getTerminalSize()
		const validateWidth = ( width: number | string ): number => {

			if ( width && typeof width === 'string' && width.endsWith( '%' ) ) {

				width = Math.floor(
					( parseInt( width.slice( 0, -1 ) ) / 100 ) * ( windowSize.width * terminalCharWidth ),
				)

			}

			return parseInt( String( width ) )

		}
		const validateHeight = ( height: number | string ): number => {

			if ( height && typeof height === 'string' && height.endsWith( '%' ) ) {

				height = Math.floor(
					( parseInt( height.slice( 0, -1 ) ) / 100 ) * ( windowSize.height ),
				)

			}

			return parseInt( String( height ) )

		}

		// Setup options
		const options = {
			fit       : opts.fit ?? 'box',
			width     : opts.width ? validateWidth( opts.width ) : validateWidth( '100%' ), //image.bitmap.width,
			height    : opts.height ? validateHeight( opts.height ) : validateHeight( '100%' ), //image.bitmap.height,
			c_ratio   : opts.c_ratio ?? 2,
			color     : opts.color !== false,
			as_string : true,
			chars     : opts.chars ?? ' .,:;i1tfLCG08@',
		}
		// console.debug( options )

		const chars   = options.chars
		const num_c   = chars.length - 1
		const newDims = calculateDims( image, options )

		// Resize to requested dimensions
		image.resize( newDims[0], newDims[1] )

		let ascii: string | string[] = options.as_string ? '' : []

		const norm = ( 255 * 4 ) / num_c

		// Get and convert pixels
		for ( let j = 0; j < image.bitmap.height; j++ ) {

			// Add new array if type
			// @ts-ignore
			if ( !options.as_string ) ( ascii as string[] ).push( [] )

			for ( let i = 0; i < image.bitmap.width; i++ ) {

				for ( let c = 0; c < options.c_ratio; c++ ) {

					let next = chars.charAt(
						Math.round( intensity( image, i, j ) / norm ),
					)

					if ( options.color ) {

						const clr = Jimp.intToRGBA( image.getPixelColor( i, j ) )
						next      = fg( next, clr.r, clr.g, clr.b )

					}

					if ( options.as_string ) ascii += next
					// @ts-ignore
					else ascii[j].push( next )

				}

			}

			if ( options.as_string && j !== image.bitmap.height - 1 )
				( ascii as string ) += '\n'

		}

		return ascii.toString()

	}
	catch ( err ) {

		throw new Error( `Error loading image: ${err}` )

	}

}

export const _getMediaInput = async ( input: string | Buffer ): Promise<Buffer> => {

	if ( typeof input === 'string' ) {

		const type = getStringType( input )

		if ( type === 'url' ) return await _fetchImage( input )
		else if ( type === 'path' ) return await readFile( input )
		else return Buffer.from( input,  'utf-8' )

	}
	else if ( Buffer.isBuffer( input ) ) return input

	throw new Error( `Invalid input type: ${typeof input}` )

}
export const _getMediaInputString = async ( input: string | Buffer ): Promise<string> => {

	if ( typeof input === 'string' ) {

		const type = getStringType( input )

		if ( type === 'url' ) input = await _fetchImage( input )
		else if ( type === 'path' ) input = await readFile( input )
		else input = Buffer.from( input,  'utf-8' )

	}

	return input.toString( 'utf-8' )

}
