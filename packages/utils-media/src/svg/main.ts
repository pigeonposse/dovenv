
import {
	_parse,
	_stringify,
	_svgToBuffer,
} from './core'
import {
	_getMediaInput,
	_getMediaInputString,
} from '../_core/main'
import {
	image,
	image2ascii,
} from '../image/main'

import type {
	Svg2AsciiProps,
	Svg2ImageProps,
	SvgProps,
} from './types'

/**
 * Converts an SVG to an image buffer.
 *
 * @param   {Svg2ImageProps}          params       - Parameters for the conversion.
 * @param   {Svg2ImageProps['input']} params.input - Input SVG data.
 * @returns {Promise<Buffer>}                      - A promise that resolves to the image buffer.
 */
export const svg2imageBuffer = async ( params: Svg2ImageProps ): Promise<Buffer> => {

	const {
		input: svgData,
		svgOptions,
	} = params

	const input = await _svgToBuffer( svgData, svgOptions )

	return input

}

/**
 * Converts an SVG to ASCII art.
 *
 * @param   {Svg2AsciiProps}          params       - Parameters for the conversion.
 * @param   {Svg2AsciiProps['input']} params.input - Input SVG data.
 * @returns {Promise<string>}                      - Promise that resolves to the ASCII representation of the SVG.
 * @example
 * // simple use with string
 * const svg = `<svg width="100" height="100">
 *   <rect width="100%" height="100%" fill="red" />
 * </svg>`
 * const ascii = await svg2ascii( { input: svg } )
 * console.log( ascii )
 * @example
 * // simple use with url
 * const svg = `https://my-web.com/my-svg-code.svg`
 * const ascii = await svg2ascii( { input: svg } )
 * console.log( ascii )
 * @example
 * // simple use with path
 * const svg = `./my-svg-path.svg`
 * const ascii = await svg2ascii( { input: svg } )
 * console.log( ascii )
 */
export const svg2ascii = async ( params: Svg2AsciiProps ) => {

	const {
		input: svgData,
		svgOptions,
		...options
	} = params

	const input = await svg2imageBuffer( {
		input : svgData,
		svgOptions,
	} )
	return await image2ascii( {
		input,
		...( options || {} ),
	} )

}

/**
 * Convert SVG to image string for terminal display.
 *
 * @param   {SvgProps}          params       - Options object.
 * @param   {SvgProps['input']} params.input - SVG data.
 * @returns {Promise<Buffer>}                - Image buffer.
 * @example
 * // simple use with string
 * const svg = `<svg width="100" height="100">
 *   <rect width="100%" height="100%" fill="red" />
 * </svg>`
 * const output = await svg2terminal( { input: svg } )
 * console.log( output )
 * @example
 * // simple use with url
 * const svg = `https://my-web.com/my-svg-code.svg`
 * const output = await svg2terminal( { input: svg } )
 * console.log( output )
 * @example
 * // simple use with path
 * const svg = `./my-svg-path.svg`
 * const output = await svg2terminal( { input: svg } )
 * console.log( output )
 */
export const svg2terminal = async ( params: SvgProps ) => {

	const {
		input: svgData,
		svgOptions,
		...options
	} = params

	const input = await svg2imageBuffer( {
		input : svgData,
		svgOptions,
	} )

	return await image( {
		input,
		...( options || {} ),
	} )

}
export const svg = {
	deserialize : _parse,
	serialize   : _stringify,
}
