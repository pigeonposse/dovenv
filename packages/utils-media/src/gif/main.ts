
import { animate }   from '@dovenv/utils'
import terminalImage from 'terminal-image'

import {
	_getMediaInput,
	asciifyImg,
} from '../_core/main'

import type {
	Gif2AsciiArrayProps,
	Gif2AsciiProps,
	Gif2ImagesProps,
	GifProps,
} from './types'

/**
 * Extracts frames from a GIF image and returns them as an array of buffers.
 *
 * @param   {Gif2ImagesProps}          params       - Options for extracting frames from the GIF.
 * @param   {Gif2ImagesProps['input']} params.input - URL, path, or Buffer containing the GIF image data.
 * @returns {Promise<Buffer[]>}                     - A promise that resolves with an array of buffers, each representing a frame of the GIF.
 */
export const gif2images = async ( params: Gif2ImagesProps ): Promise<Buffer[]> => {

	const { input }   = params
	const inputBuffer = await _getMediaInput( input )
	// @ts-ignore
	const gifFrames = await import( 'gif-frames' )
	const frames    = await gifFrames( {
		url        : inputBuffer,
		frames     : 'all',
		outputType : 'png',
	} )
	// console.log( { frames } )
	// @ts-ignore
	return frames.map( frame => frame.getImage() )

}

/**
 * Converts each frame of a GIF image to an ASCII string.
 *
 * @param   {Gif2AsciiArrayProps}          params       - Options for converting the GIF.
 * @param   {Gif2AsciiArrayProps['input']} params.input - URL or path of the GIF image, or a Buffer containing the image data.
 * @returns {Promise<string[]>}                         - A promise that resolves with an array of ASCII strings, each representing a frame of the GIF.
 */
export const gif2asciiArray = async ( params: Gif2AsciiArrayProps ): Promise<string[]> => {

	const {
		input, ...options
	} = params
	const inputBuffer = await gif2images( { input } )
	const res         = []
	for ( let i = 0; i < inputBuffer.length; i++ ) {

		res[i] = await asciifyImg( {
			input : inputBuffer[i],
			...options,
		} )

	}

	return res

}

/**
 * Converts a GIF to an ASCII animation.
 *
 * @param   {Gif2AsciiProps}            params           - Options for converting the GIF.
 * @param   {Gif2AsciiProps['input']}   params.input     - URL or path of the GIF image, or a Buffer containing the image data.
 * @param   {Gif2AsciiProps['animate']} [params.animate] - Options for the animation.
 * @returns {Promise<string>}                            - A promise that resolves with a string containing the ASCII animation.
 */
export const gif2ascii = async ( params: Gif2AsciiProps ) => {

	const {
		animate: animateOptions,
		...options
	} = params
	const frames = await gif2asciiArray( options )

	return await animate( {
		frames,
		...( animateOptions || {} ),
	} )

}

/**
 * Displays a GIF in the terminal.
 *
 * @param   {GifProps}                    params       - Options for displaying the GIF.
 * @param   {GifProps['input']}           params.input - URL or path of the GIF image, or a Buffer containing the image data.
 * @returns {Promise<{stop: () => void}>}              - A promise that resolves with an object containing a single method `stop()`. Calling `stop()` will clear the GIF from the terminal.
 * @example
 *
 * // simple use with url
 * const myGif = await gif({
 *   input: 'https://64.media.tumblr.com/38adef3da23d26058e3085ce271b39c1/tumblr_nil77wk20l1qhnszoo1_400.gifv'
 * });
 * const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
 * await myGif.start();
 * await delay(5000);
 * await myGif.stop();
 * await delay(2000);
 * await myGif.start();
 */
export const gif = async ( params: GifProps ) => {

	const {
		input, ...options
	} = params

	const inputBuffer = await _getMediaInput( input )
	if ( options?.asciiOutput ) {

		const opts = options?.asciiOptions
			? {
				width  : options.width,
				height : options.height,
				...options.asciiOptions,
			}
			: {
				width  : options.width,
				height : options.height,
			}

		return await gif2ascii( {
			input,
			...opts,
		} )

	}
	else {

		let gif: () => void = () => {}
		const start         = async () => {

			gif = await terminalImage.gifBuffer( inputBuffer, options )

		}

		return {
			start,
			stop : async () => gif(),
		}

	}

}
