
import { matcher } from 'matcher'
import stringWidth from 'string-width'

import { isPath } from '@/sys/super'

export * from './placeholder'
export * from './count'
export * from './cases'

export { stringWidth }

/**
 * Indents a given string by prefixing each line with a given prefix
 * (default is two spaces).
 *
 * @param   {string} v        - The string to indent.
 * @param   {string} [prefix] - The prefix to prepend to each line (default is two spaces).
 * @returns {string}          - The indented string.
 */
export const indent = ( v:string, prefix = '  ' ) =>
	v.split( '\n' ).map( line => `${prefix}${line}` ).join( '\n' )

/**
 * Capitalizes the first letter of a word.
 *
 * @param   {string} s - The word to capitalize.
 * @returns {string}   - The capitalized word.
 */
export const capitalize = ( s: string ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 )

/**
 * Truncates a given string to a maximum length and adds an ellipsis (...) at the end.
 *
 * @param   {string} text       - The string to truncate.
 * @param   {number} maxLength  - The maximum length of the string.
 * @param   {string} [ellipsis] - The ellipsis to add at the end of the truncated string (default is '…').
 * @returns {string}            - The truncated string.
 */
export const truncate = ( text: string, maxLength: number, ellipsis: string = '…' ): string => {

	if ( text.length <= maxLength ) return text
	return text.slice( 0, maxLength ).trimEnd() + ellipsis

}

export const getMatch = matcher
export const getStringType = ( value: string ): 'text' | 'url' | 'path' => {

	if ( isUrl( value ) ) return 'url'
	if ( isPath( value ) ) return 'path'
	return 'text'

}

const isUrl = ( value: string ): boolean => {

	try {

		new URL( value )
		return true

	}
	catch {

		return false

	}

}

/**
 * Joins the given URL parts into a single string.
 *
 * @param   {string[]} parts - The URL parts to join.
 * @returns {string}         - The joined URL string.
 */
export const joinUrl = ( ...parts: string[] ) => {

	parts = parts.map( part => part.replace( /^\/+|\/+$/g, '' ) )

	return parts.join( '/' )

}

/**
 * Converts an object to a JSON string.
 *
 * @param   {unknown} data - The data to convert to a string.
 * @returns {string}       - The JSON string representation of the data.
 */
export const object2string = ( data: unknown ): string => JSON.stringify( data, null, '\t' ) + '\n'

/**
 * Generates a random UUID.
 *
 * @returns {string} - The generated UUID.
 */
export const getRandomUUID = () => crypto.randomUUID()
