import { setDirectoryTree } from '../string/tree'
import {
	joinPath,
	readDir,
} from './super/main'

/**
 * Generates an object representing the directory structure of a given path.
 * @param {string} dirPath - The root path of the directory to read.
 * @returns {object} The directory structure as a nested object.
 */
const readDirectoryStructure = async ( dirPath: string ) => {

	const buildStructure = async ( currentPath: string ): Promise<object> => {

		const entries                            = await readDir( currentPath )
		const structure: Record<string, unknown> = {}

		for ( const entry of entries ) {

			const fullPath = joinPath( currentPath, entry.name )
			if ( entry.isDirectory() )
				structure[entry.name] = await buildStructure( fullPath )
			else structure[entry.name] = null

		}
		return structure

	}

	return await buildStructure( dirPath )

}

/**
 * Generates a string representing the directory structure of a given path.
 * @param {object} props - Function props.
 * @param {string} props.input - The root path of the directory to read.
 * @returns {Promise<string>} The directory structure as a string.
 */
export const getDirectoryTreeFromPath = async ( props: Omit<Parameters<typeof setDirectoryTree>[0], 'structure'> & { input: string } ): Promise<string> => {

	const {
		input, ...rest
	} = props
	const structure = await readDirectoryStructure( input )
	const output    = setDirectoryTree( {
		structure,
		...rest,
	} )

	return output

}

// const r = await getDirectoryTreeFromPath( {
// 	input : process.cwd(),
// 	name  : 'current-dir',
// } )
// console.log( r )
