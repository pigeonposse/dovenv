import { color } from '../styles/main'

/**
 * Returns a string representing the content of an object as a directory structure.
 * @param {object} opts An object with options for generating the directory structure string.
 * @param {object} opts.structure - An object representing the directory structure.
 * @param {string} [opts.name] - The name of the root directory. If provided, it will be printed as the first line.
 * @param {Function} [opts.folderStyle] - A function that returns a string representing a directory.
 *                                         Receives an object with properties: name, indent, isLast, and isFirst.
 * @param {Function} [opts.fileStyle] - A function that returns a string representing a file.
 *                                       Receives an object with properties: name, indent, isLast, and isFirst.
 * @returns {string} A string representing the content of `structure` as a directory structure.
 *
 * ---
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
export const setDirTree = ( opts: {
	structure    : object
	name?        : string
	folderStyle? : ( opts: {
		name    : string
		indent  : number
		isLast  : boolean
		isFirst : boolean
	} ) => string
	fileStyle?   : ( opts: {
		name    : string
		indent  : number
		isLast  : boolean
		isFirst : boolean
	} ) => string
} ): string => {

	const pattern = {
		indent   : color.gray.dim( '│   ' ),
		line     : color.gray.dim( '├── ' ),
		lastLine : color.gray.dim( '└── ' ),
	}

	// Default folder style
	const folderStyle = opts.folderStyle
		? opts.folderStyle
		: ( {
			name, indent, isLast,
		}: {
			name    : string
			indent  : number
			isLast  : boolean
			isFirst : boolean
		} ) => {

			const prefix = pattern.indent.repeat( indent ) + ( isLast ? pattern.lastLine : pattern.line )
			return prefix + color.blue.bold( name )

		}

	// Default file style
	const fileStyle = opts.fileStyle
		? opts.fileStyle
		: ( {
			name, indent, isLast,
		}: {
			name    : string
			indent  : number
			isLast  : boolean
			isFirst : boolean
		} ) => {

			const prefix = pattern.indent.repeat( indent ) + ( isLast ? pattern.lastLine : pattern.line )
			return prefix + color.green( name )

		}

	// Recursive function to build the directory tree
	const _setDirTree = ( dir: object, indent = 0 ): string => {

		const entries = Object.entries( dir )
		let result    = ''

		entries.forEach( ( [ key, value ], index ) => {

			const isFolder = typeof value === 'object' && value !== null
			const isLast   = index === entries.length - 1
			const isFirst  = index === 0
			const styleFn  = isFolder ? folderStyle : fileStyle

			result += styleFn( {
				name : key,
				indent,
				isLast,
				isFirst,
			} ) + '\n'

			// If it's a folder, recurse into its contents
			if ( isFolder ) {

				result += _setDirTree( value, indent + 1 )

			}

		} )

		return result

	}

	// Build the full tree string
	return ( opts.name ? opts.name + '\n' : '' ) + _setDirTree( opts.structure, opts.name ? 1 : 0 )

}
