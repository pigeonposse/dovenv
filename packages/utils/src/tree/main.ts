import { setDirTree } from './set'
import {
	joinPath,
	readDir,
	getPaths,
} from '../sys/super/main'

import type {
	DirStructureParams,
	PathsStructureParams,
	PathTreeOpts,
	PatternTreeOpts,
} from './types'

export { setDirTree }

/**
 * Generates an object representing the directory structure of a given path.
 * Limits the traversal depth based on the maximum number of child directories (if specified).
 * @param {object} opts - Options.
 * @param {string} opts.input - The root path of the directory to read.
 * @param {number} [opts.max] - Maximum number of child directories to include (default is Infinity).
 * @returns {Promise<object>} The directory structure as a nested object.
 */
const getDirStructure = async ( opts: DirStructureParams ): Promise<object> => {

	if ( !opts.input ) throw new Error( 'The \'input\' path is required.' )

	// Default to no limit
	const maxDepth  = opts.max ?? Infinity
	const sortOrder = opts?.sort || 'atoz' // Default to 'atoz'

	// Helper function to build the structure
	const _buildStructure = async ( currentPath: string, depth: number ): Promise<object> => {

		// Stop recursion if max depth is reached
		if ( depth <= 0 ) return {}

		// Read the current directory entries
		const entries                            = await readDir( currentPath )
		const structure: Record<string, unknown> = {}

		// Sort entries based on the sort option
		const sortedEntries = entries.sort( ( a, b ) => {

			const compare = a.name.localeCompare( b.name )
			return sortOrder === 'atoz' ? compare : -compare

		} )

		// Process entries concurrently
		await Promise.all(
			sortedEntries.map( async entry => {

				const fullPath = joinPath( currentPath, entry.name )

				if ( entry.isDirectory() ) {

					// Recurse into subdirectories only if depth allows
					structure[entry.name] = await _buildStructure( fullPath, depth - 1 )

				}
				else {

					// Add files as null
					structure[entry.name] = null

				}

			} ),
		)

		return structure

	}

	// Start building the structure from the root input
	return await _buildStructure( opts.input, maxDepth )

}

/**
 * Generates a string representing the directory structure of a given path.
 * @param {object} props - Function props.
 * @param {string} props.input - The root path of the directory to read.
 * @returns {Promise<string>} The directory structure as a string.
 */
export const getDirTree = async ( props: PathTreeOpts ): Promise<string> => {

	const {
		input, ...rest
	} = props
	const structure = await getDirStructure( props )
	const output    = setDirTree( {
		structure,
		...rest,
	} )

	return output

}

export const getPathsStructure = async ( props: PathsStructureParams ): Promise<object> => {

	// example paths => [
	// 	"pnpm-lock.yaml", "LICENSE", "README.md", "package.json", "eslint.config.js", "pnpm-workspace.yaml",
	// 	"packages/core/build.config.js", "packages/core/README.md", "packages/core/package.json",
	// 	"packages/core/tsconfig.json", "packages/utils/build.config.js", "packages/utils/README.md",
	// 	"packages/utils/package.json", "packages/utils/tsconfig.json", "packages/create/build.config.js",
	// 	"packages/create/README.md", "packages/create/package.json", "packages/create/tsconfig.json"
	//   ]

	const paths = await getPaths( props.input, props.patternOpts )

	const maxDepth  = props.max ?? Infinity
	const sortOrder = props?.sort || 'atoz'

	if ( !paths || paths.length === 0 ) throw new Error( 'No files found' )

	const sortedPaths = paths.sort( ( a, b ) => {

		const compare = a.localeCompare( b )
		return sortOrder === 'atoz' ? compare : -compare

	} )

	const buildStructure = ( paths: string[], depth: number ): object => {

		if ( depth <= 0 ) return {}

		const structure: Record<string, unknown> = {}

		paths.forEach( path => {

			const parts = path.split( '/' )

			if ( parts.length > depth ) {

				parts.length = depth

			}

			// @ts-ignore
			parts.reduce( ( subAcc, part, index ) => {

				if ( !subAcc[part] ) subAcc[part] = index === parts.length - 1 ? null : {}
				return subAcc[part]

			}, structure )

		} )

		return structure

	}

	const structure = buildStructure( sortedPaths, maxDepth )
	return structure

}

export const getPathsTree = async ( props: PatternTreeOpts ) => {

	const {
		input, ...rest
	} = props
	const structure = await getPathsStructure( props )
	const output    = setDirTree( {
		structure,
		...rest,
	} )

	return output

}
