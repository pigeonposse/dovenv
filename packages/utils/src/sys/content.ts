import {
	getDirName,
	getPaths,
	readFile,
	validateHomeDir,
} from './super/main'
import { getStringType } from '../string/main'

export const getFileText = async ( path:string ) => {

	path                    = validateHomeDir( path )
	const fileContentBuffer = await readFile( path )
	const fileContent       = fileContentBuffer.toString( 'utf8' )
	return fileContent

}

/**
 * Fetch content from a URL to string.
 * @param   {string}          url - URL of the resource.
 * @returns {Promise<string>}     - The fetched content.
 * @throws {Error} If there is an error fetching content from the URL.
 * @example import { fetch2string } from '@dovenv/utils'
 *
 * const imageData = await fetch2string('https://source.unsplash.com/random')
 * console.log(imageData)
 */
export async function fetch2string( url: string ): Promise<string> {

	try {

		const response    = await fetch( url )
		const contentType = response.headers.get( 'content-type' )

		if ( contentType?.includes( 'image' ) ) {

			const buffer       = Buffer.from( await response.arrayBuffer() )
			const base64String = buffer.toString( 'base64' )
			const dataUri      = `data:image/jpeg;base64,${base64String}`
			return dataUri

		}
		else {

			const text = await response.text()
			return text

		}

	}
	catch ( error ) {

		// @ts-ignore
		throw new Error( `Fetching URL Error: ${error.message}` )

	}

}

/**
 *
 * Fetches all strings from a given patterns (URLs or paths).
 * @param   {string[]} patterns - An array of strings with URLs or paths.
 * @returns {Promise<object[]>} - The fetched content.
 * @throws {Error} If there is an error fetching content from the URLs or paths.
 * @example import { getStringsFrom } from '@dovenv/utils'
 *
 * const patterns = [
 *   'https://pigeonposse.com', // fetches and returns content as a string
 *   './docs/*.md',             // reads files matching the pattern and returns content as strings
 *   'Just a simple string'     // returns the same string as provided
 * ];
 *
 * const data = await getStringsFrom(patterns);
 * console.log(data);
 */
export const getStringsFrom = async ( patterns: string[] ) => {

	const res = []

	for ( let index = 0; index < patterns.length; index++ ) {

		const pattern = patterns[index]
		const type    = getStringType( pattern )

		if ( type === 'path' ) {

			const paths = await getPaths( pattern )
			for ( const path of paths ) res.push( {
				type,
				path    : path,
				id      : `${getDirName( path )}`,
				content : await getFileText( path ),
			} )

		}
		else if ( type === 'url' )
			res.push( {
				type,
				path    : pattern,
				id      : `${type}-${( new URL( pattern ) ).hostname}-${index}`,
				content : await fetch2string( pattern ),
			} )
		else res.push( {
			type,
			id      : `${type}-${index}`,
			content : pattern,
		} )

	}

	return res

}
