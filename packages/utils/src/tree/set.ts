import type {
	SetDirTree,
	SetDirTreeStyleParams,
} from './types'

import { color } from '@/styles'

/**
 * Returns a string representing the content of an object as a directory structure.
 *
 * @param   {object}   opts           - An object with options for generating the directory structure string.
 * @param   {object}   opts.structure - An object representing the directory structure.
 * @param   {string}   [opts.name]    - The name of the root directory. If provided, it will be printed as the first line.
 * @param   {Function} [opts.style]   - A function that returns a string representing an item (folder or file).
 *                                    Receives an object with properties: name, indent, isLast, isFirst, isFolder.
 * @returns {string}                  A string representing the content of `structure` as a directory structure.
 *
 *                                    ---.
 * @example
 *
 * const result = setDirTree({
 *   structure: {
 *   src: {
 *     components: {
 *       "Button.js": null,
 *       "Header.js": null
 *     },
 *     utils: {
 *       "helpers.js": null
 *     },
 *     "index.js": null
 *   },
 *   "package.json": null
 *   },
 *   name: "my-project",
 * });
 *
 * console.log(result);
 */
export const setDirTree = ( opts: SetDirTree ): string => {

	const pattern = {
		lastFolder : color.gray.dim( '    ' ),
		indent     : color.gray.dim( '│   ' ),
		line       : color.gray.dim( '├── ' ),
		lastLine   : color.gray.dim( '└── ' ),
	}

	// Default style function
	const defaultStyle = ( {
		name,
		indent,
		isLast,
		isFolder,
	}: SetDirTreeStyleParams ): string => {

		const prefix = ( isLast && isFolder && indent === 0 ? pattern.lastFolder : pattern.indent ).repeat( indent ) + ( isLast ? pattern.lastLine : pattern.line )
		return prefix + ( isFolder ? color.blue.bold( name ) : color.green( name ) )

	}

	const styleFn = opts.style || defaultStyle

	// Recursive function to build the directory tree
	const _setDirTree = ( dir: object, indent = 0 ): string => {

		const entries = Object.entries( dir )
		let result    = ''

		for ( let index = 0; index < entries.length; index++ ) {

			const [ key, value ] = entries[index]
			const isFolder       = typeof value === 'object' && value !== null
			const isLast         = index === entries.length - 1
			const isFirst        = index === 0

			// Apply the style function
			result += styleFn( {
				name : key,
				indent,
				isLast,
				isFirst,
				isFolder,
			} ) + '\n'

			// If it's a folder, recurse into its contents
			if ( isFolder ) {

				result += _setDirTree( value, indent + 1 )

			}

		}

		return result

	}

	// Build the full tree string
	return ( opts.name ? opts.name + '\n' : '' ) + _setDirTree( opts.structure, opts.name ? 1 : 0 )

}
