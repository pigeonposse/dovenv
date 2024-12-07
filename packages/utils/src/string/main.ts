
import { matcher } from 'matcher'
import stringWidth from 'string-width'

import { isPath } from '../sys/super/main'

export * from './placeholder'
export * from './count'

export { stringWidth }

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
 * @param {string[]} parts - The URL parts to join.
 * @returns {string} - The joined URL string.
 */
export const joinUrl = ( ...parts: string[] ) => {

	parts = parts.map( part => part.replace( /^\/+|\/+$/g, '' ) )

	return parts.join( '/' )

}

/**
 * Converts an object to a JSON string.
 * @param {unknown} data - The data to convert to a string.
 * @returns {string} - The JSON string representation of the data.
 */
export const object2string = ( data: unknown ): string => JSON.stringify( data, null, '\t' ) + '\n'

