import Jimp from 'jimp-compact'

import type { Ascci2ImgOptions } from './types'

/**
 * Sanitizes ASCII input by removing non-printable characters and normalizing newlines.
 *
 * @param   {string} input - The ASCII string to sanitize.
 * @returns {string}       The sanitized ASCII string.
 */
const sanitizeAscii = ( input: string ): string => {

	const sanitized = input.replace( /[^\x20-\x7E\n]/g, '' )
	return sanitized.replace( /\r\n|\r/g, '\n' )

}

/**
 * Convert an ASCII string to a PNG image.
 *
 * @param   {Ascci2ImgOptions} options - Options for the conversion.
 * @returns {Promise<Buffer>}          The PNG image as a Buffer.
 */
export const ascii2image = async ( {
	input,
	charWidth = 8,
	charHeight = 16,
	bgColor = 'transparent',
	fontPath = Jimp.FONT_SANS_16_BLACK, // Default font
}: Ascci2ImgOptions ): Promise<Buffer> => {

	const sanitizedInput = sanitizeAscii( input )
	const font           = await Jimp.loadFont( fontPath )
	const {
		lineHeight, scaleW,
	} = font.common

	// Determine character dimensions
	const calculatedCharHeight = charHeight || lineHeight || 16
	const calculatedCharWidth  = charWidth || Math.floor( scaleW / 95 ) || 8 // Assuming ~95 printable ASCII chars

	// Split ASCII string into lines
	const lines         = sanitizedInput.split( '\n' )
	const maxLineLength = Math.max( ...lines.map( line => line.length ) )
	const width         = calculatedCharWidth * maxLineLength
	const height        = calculatedCharHeight * lines.length

	// Create a new blank image
	const image = new Jimp( width, height, bgColor )

	// Render each line of ASCII onto the image
	for ( let y = 0; y < lines.length; y++ ) {

		const line = lines[y]
		image.print( font, 0, y * calculatedCharHeight, {
			text       : line,
			alignmentX : Jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY : Jimp.VERTICAL_ALIGN_TOP,
		} )

	}

	return await image.getBufferAsync( Jimp.MIME_PNG )

}
