
import type { Text2ImageProps } from './types'

/**
 * Converts text to an image.
 * @param {Text2ImageProps} params Parameters to convert text to image.
 * @returns {Promise<Buffer>} The image buffer.
 * @example
 * const buffer = await text2image( {
 *   input : 'Hello world!',
 *   fontSize : 42,
 *   backgroundColor : '#fff',
 * } )
 */
export const text2image = async ( params: Text2ImageProps ) => {

	const { UltimateTextToImage } = await import( 'ultimate-text-to-image' )
	const {
		input, ...options
	} = params
	const black                   = '#000000'
	const transparent             = '#ffffff00'
	const textToImage             = new UltimateTextToImage( input, {
		...{
			width           : 400,
			maxWidth        : 1000,
			maxHeight       : 1000,
			fontColor       : black,
			fontSize        : 72,
			minFontSize     : 10,
			lineHeight      : 50,
			margin          : 20,
			align           : 'center',
			valign          : 'middle',
			backgroundColor : transparent,
			strokeColor     : transparent,
			borderColor     : transparent,
			underlineColor  : transparent,

		},
		...options || {},
	} )

	return textToImage.render().toBuffer( 'image/png' )

}
