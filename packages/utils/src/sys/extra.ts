import {
	getPaths,
	readFile,
} from './super/main'

/**
 * Gets the total number of characters in all files matching the given glob pattern.
 * @param {string[]} pattern - The glob pattern to search for.
 * @returns {Promise<number>} - The total number of characters in all matching files.
 * @throws {Error} If an error occurs while reading the files.
 * @example const totalChars = await getCharsNumFrom(['*.md'])
 */
export const getCharsNumFrom = async ( pattern: string[] ): Promise<number> => {

	try {

		const files         = await getPaths( pattern, { onlyFiles: true } )
		let totalCharacters = 0

		for ( const file of files ) {

			const content    = await readFile( file, 'utf-8' )
			totalCharacters += content.length

		}

		return totalCharacters

	}
	catch ( error ) {

		console.error( 'Error reading files:', error )
		throw error

	}

}
