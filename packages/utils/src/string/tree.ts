import { color } from '../styles/main'

/**
 * Returns a string representing the content of an object as a directory structure.
 * @param {object} opts An object with options for generating the directory structure string.
 * @param {object} opts.structure - An object representing the directory structure.
 * @param {string} [opts.name] - The name of the root directory. If provided, it will be printed as the first line.
 * @param {Function} [opts.folderStyle] - A function that returns a string representing a directory.
 *                                         Receives two parameters: the directory name and the indentation level.
 * @param {Function} [opts.fileStyle] - A function that returns a string representing a file.
 *                                       Receives two parameters: the file name and the indentation level.
 * @returns {string} A string representing the content of `structure` as a directory structure.
 * @example
 *
 * const result = setDirectoryTree({
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
export const setDirectoryTree = ( opts: {
	structure    : object
	name?        : string
	folderStyle? : ( name : string, indent: number ) => string
	fileStyle?   : ( name : string, indent: number  ) => string
} ): string => {

	const folderStyle = opts?.folderStyle
		? opts?.folderStyle
		: ( v: string, i: number  ) => {

			let res = '  '.repeat( i ) + color.gray.dim( '│\n' )
			res    += '  '.repeat( i ) + color.gray.dim( '└─── ' ) + color.blue.bold( `${v} ` )

			return res

		}
	const fileStyle = opts?.fileStyle
		? opts?.fileStyle
		: ( v: string, i: number ) => {

			const res = '  '.repeat( i ) + color.gray.dim( '└─── ' ) + color.green( `${v} ` )
			return res

		}

	const setDirectoryTree = ( dir: object, indent = 0 ): string => {

		let res = ''
		for ( const [ key, value ] of Object.entries( dir ) ) {

			const isFolder = typeof value === 'object' && value !== null
			const name     = isFolder ? folderStyle( key, indent ) : fileStyle( key, indent )
			res           += name + '\n'
			if ( isFolder ) res += setDirectoryTree( value, indent + 1 )

		}

		return res

	}

	return ( opts?.name ? opts.name + '\n'  : '' ) + setDirectoryTree( opts.structure,  opts.name ? 1 : 0 )

}
