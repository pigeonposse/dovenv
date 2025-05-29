import { Tree } from '@ascii-kit/tree'

import type { SetDirTree } from './types'

import { color } from '@/styles'

/**
 * Returns a string representing the content of an object as a directory structure.
 *
 * @param   {object} opts           - An object with options for generating the directory structure string.
 * @param   {object} opts.structure - An object representing the directory structure.
 *                                  Receives an object with properties: name, indent, isLast, isFirst, isFolder.
 * @returns {string}                A string representing the content of `structure` as a directory structure.
 *
 *                                  ---.
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

	const res = new Tree( opts.structure, {
		hook : { onData : data => {

			data.name    = color[!data.isFile ? 'blue' : 'green']( data.name )
			data.pattern = {
				indent   : color.gray.dim( data.pattern.indent ),
				line     : color.gray.dim( data.pattern.line ),
				lastLine : color.gray.dim( data.pattern.lastLine ),
			}
			return data

		} },
		...( opts || {} ),
	} )
	return res.generate()

}
