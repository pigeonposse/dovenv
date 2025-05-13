/* eslint-disable jsdoc/require-jsdoc */
import stringWidth from 'string-width'

type Align = 'left' | 'center' | 'right'

interface Options {
	/**
	 * Aligns text to the left, center or right.
	 *
	 * @default 'center'
	 */
	align? : Align
	/**
	 * Split text on newlines.
	 */
	split? : string
	/**
	 * Padding character.
	 */
	pad?   : string
}

/**
 * Aligns ANSI strings to the left, center or right.
 *
 * @param   {string|string[]} text   - The text to align.
 * @param   {object}          [opts] - Options object.
 * @returns {string|string[]}        The aligned text, or an array of strings if input is an array.
 */
export const align = ( text: string | string[], opts: Options = {} ): string | string[] => {

	if ( !text ) return text

	const alignment: Align = opts.align || 'center'
	let width: number,
		maxWidth = 0,
		returnString = false

	// short-circuit `align: 'left'` as no-op
	if ( alignment === 'left' ) return text

	const split: string = opts.split || '\n'
	const pad: string   = opts.pad || ' '
	const widthDiffFn   = alignment !== 'right' ? halfDiff : fullDiff

	if ( !Array.isArray( text ) ) {

		returnString = true
		text         = String( text ).split( split )

	}

	text = text.map( ( str: string ) => {

		str      = String( str )
		width    = stringWidth( str )
		maxWidth = Math.max( width, maxWidth )
		return {
			str,
			width,
		}

	} ).map( ( obj: {
		str   : string
		width : number
	} ) => {

		return new Array( widthDiffFn( maxWidth, obj.width ) + 1 ).join( pad ) + obj.str

	} )

	return returnString ? text.join( split ) : text

}

function halfDiff( maxWidth: number, curWidth: number ): number {

	return Math.floor( ( maxWidth - curWidth ) / 2 )

}

function fullDiff( maxWidth: number, curWidth: number ): number {

	return maxWidth - curWidth

}

