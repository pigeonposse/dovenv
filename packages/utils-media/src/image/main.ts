
/**
 * Images in the terminal.
 * @description Functions for display images and gifs in terminal.
 */

import { writeFileContent } from '@dovenv/utils'
import { Buffer }           from 'node:buffer'
import terminalImage        from 'terminal-image' // 47MB @see https://pkg-size.dev/terminal-image

import {
	_getMediaInput,
	_getMediaInputString,
	asciifyImg,
} from '../_core/main'

import type {
	ImageProps,
	Image2AsciiProps,
} from './types'

/**
 * Converts an image to ASCII art.
 * @param   {Image2AsciiProps} params - Parameters for the conversion.
 * @param   {Buffer | string} params.input - Input image as a buffer or file path/URL.
 * @returns {Promise<string>} - Promise that resolves to the ASCII representation of the image.
 * @example
 * // simple use with url
 * const IMG = await image2ascii( {
 *    input: 'https://avatars.githubusercontent.com/u/111685953'
 * });
 * console.log( IMG );
 * @example
 * // simple use with path
 * const IMG = await image2ascii( {
 *   input: './image.png'
 * });
 * console.log( IMG );
 * @example
 */
export const image2ascii = async ( params: Image2AsciiProps ) => {

	const {
		input, ...options
	} = params
	const inputBuffer = await _getMediaInput( params.input )

	return await asciifyImg( {
		input : inputBuffer,
		...options,
	} )

}

/**
 * Return an image for been print.
 * @param   {ImageProps} params - Options to customize the display of the image.
 * @param   {ImageProps['input']} params.input - Input to the image PATH, URL or BUFFER. Format suppported: PNG and JPEG.
 * @returns {Promise<string>}           - Promise that resolves with the image formatted for the terminal.
 * @example
 * // simple use with url
 * const IMG = await image( {
 *    input: 'https://avatars.githubusercontent.com/u/111685953'
 * });
 * console.log( IMG );
 * @example
 * // simple use with path
 * const IMG = await image( {
 *   input: './image.png'
 * });
 * console.log( IMG );
 * @example
 * // ascii output
 * const IMG = await image( {
 *   input: 'https://avatars.githubusercontent.com/u/111685953',
 *   asciiOutput: true
 * });
 * console.log(IMG);
 * @example
 * // ascii output with custom opts
 * const IMG = await image( {
 *    input: 'https://avatars.githubusercontent.com/u/111685953',
 *    width: '100%',
 *    height: '100%',
 *    preserveAspectRatio: true,
 *    asciiOutput: true,
 *    asciiOptions: {
 *       chars: ' #*',
 *    }
 * });
 * console.log(IMG);
 */
export const image = async ( params: ImageProps ) : Promise<string> => {

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

		return await asciifyImg( {
			input : inputBuffer,
			...opts,
		} )

	}
	else {

		return terminalImage.buffer( inputBuffer, options )

	}

}

/**
 * Converts a base64-encoded image string into a Buffer.
 * @param {string} input - The base64 string representing the image, including the data URI scheme.
 * @returns {Promise<Buffer>} - A promise that resolves to a Buffer containing the image data.
 * @throws {Error} - If the input string is not a valid base64 image string.
 */
export const base642ImageBuffer = async ( input: string ) => {

	input = await _getMediaInputString( input )
	// Extract the content type and base64 data
	// eslint-disable-next-line no-useless-escape
	const matches = input.match( /^data:([A-Za-z-+\/]+);base64,(.+)$/ )
	// const contentType = matches[1]
	if ( !matches ) throw Error( 'Invalid base image' )
	const base64Data = matches[2]

	// Convert base64 to buffer
	return Buffer.from( base64Data, 'base64' )

}

/**
 * Writes a base64-encoded image to a file.
 * @param {string} opts - The options object containing the input and output file paths.
 * @returns {Promise<void>} - A promise that resolves when the file has been written.
 */
export const writeImageFromBase64 = async ( {
	input, output,
}:{
	input  : string
	output : string
} ): Promise<void> => {

	const buffer = await base642ImageBuffer( input )

	// Write the buffer to a file
	await writeFileContent( output, buffer )

}

