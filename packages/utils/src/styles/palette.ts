import Vibrant from 'node-vibrant'

/**
 * Extracts the color palette from the given image.
 * @param {string | HTMLImageElement | Buffer} input - The image path or URL or HTMLImageElement or buffer.
 * @returns {Promise<object>} - The color palette.
 * @example
 * // simple use
 * import { getPalette } from '@dovenv/utils'
 * const palette = await getPalette( 'docs/public/logo.png' )
 * console.log( palette )
 */
export const getPalette = async ( input: string | HTMLImageElement | Buffer ) => {

	const colors = Vibrant.from( input )

	return await colors.getPalette()

}

