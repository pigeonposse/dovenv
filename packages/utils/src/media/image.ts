/* eslint-disable camelcase */
/**
 * Images in the terminal.
 * @description Functions for display images and gifs in terminal.
 * @todo Fix gif output.
 */
// @ts-ignore
import img2ascii     from 'image-to-ascii'
import { Buffer }    from 'node:buffer'
import terminalImage from 'terminal-image'

import type {
	GifOptions,
	GraphicInput,
	ImageOptions,
	ImageToAsciiOptions,
} from './types'

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

/**
 * Return an image for been print.
 * @param   {GraphicInput}    input     - Input to the image PATH, URL or BUFFER. Format suppported: PNG and JPEG.
 * @param   {ImageOptions}    [options] - Options to customize the display of the image.
 * @returns {Promise<string>}           - Promise that resolves with the image formatted for the terminal.
 * @example
 *
 * // simple use with url
 * const IMG = await image( 'https://avatars.githubusercontent.com/u/111685953' )
 * console.log( IMG )
 *
 * // simple use with path
 * const IMG = await image( './image.png' )
 * console.log( IMG )
 *
 * // ascii output
 * const IMG = await image('https://avatars.githubusercontent.com/u/111685953',
 * 	  { asciiOutput: true }
 * );
 * console.log(IMG);
 *
 * // ascii output with custom opts
 * const IMG = await image(imageUrl, {
 *     width: 50,
 *     height: 20,
 *     preserveAspectRatio: true,
 *     asciiOutput: true,
 *     asciiOptions: {
 *         colored: true,
 *     }
 * );
 * console.log(IMG);
 */
export const image = async ( input: GraphicInput, options?: ImageOptions ) : Promise<string> => {

	if ( options?.asciiOutput ) {

		const opts: ImageToAsciiOptions = options?.asciiOptions || {}

		if ( typeof input === 'string' && ( input.startsWith( 'https://' ) || input.startsWith( 'https://' ) ) )
			input = await _fetchImage( input )

		return new Promise( ( resolve, reject ) => {

			if ( options.preserveAspectRatio ) {

				if ( !opts.size_options ) opts.size_options = {}
				opts.size_options.preserve_aspect_ratio = options.preserveAspectRatio

			}
			if ( options.width ) {

				if ( !opts.size ) opts.size = {}
				opts.size.width = options.width

			}
			if ( options.height ) {

				if ( !opts.size ) opts.size = {}
				opts.size.height = options.height

			}

			// @ts-ignore
			img2ascii( input, opts, ( error, img ) => {

				if ( error ) {

					reject( error ) // Rechazar la promesa si hay un error
					return

				}
				resolve( img as string ) // Resolver la promesa con la imagen ASCII

			} )

		} )

	}
	else {

		if ( typeof input === 'string' ) {

			if ( input.startsWith( 'https://' ) || input.startsWith( 'https://' ) ) {

				input = await _fetchImage( input )
				return terminalImage.buffer( input, options )

			}
			else
				return terminalImage.file( input, options )

		}
		if ( Buffer.isBuffer( input ) ) return terminalImage.buffer( input, options )

	}

	throw Error( 'Input is neither a string nor a buffer' )

}

/**
 * Display a GIF in the terminal.
 * @param   {GraphicInput}    input     - Input to the gif PATH, URL or BUFFER.
 * @param   {GifOptions}      [options] - Options to customize the display of the GIF.
 * @returns {Promise<string>}           - Promise that resolves with the GIF formatted for the terminal.
 * @example
 *
 * // simple use with url
 * await gif( 'https://64.media.tumblr.com/38adef3da23d26058e3085ce271b39c1/tumblr_nil77wk20l1qhnszoo1_400.gifv' )
 *
 * // simple use with path
 * await gif( './my-gif.gif' )
 */
export const gif = async ( input: GraphicInput, options?: GifOptions ) => {

	if ( typeof input === 'string' ) {

		if ( input.startsWith( 'https://' ) || input.startsWith( 'https://' ) ) {

			input = await _fetchImage( input )
			return terminalImage.gifBuffer( input, options )

		}
		else
			return terminalImage.gifFile( input, options )

	}
	if ( Buffer.isBuffer( input ) ) return terminalImage.gifBuffer( input, options )

	throw Error( 'Input is neither a string nor a buffer' )

}

