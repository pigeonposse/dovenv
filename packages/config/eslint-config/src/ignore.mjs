import { includeIgnoreFile } from '@eslint/compat'
import { resolve }           from 'node:path'

/**
 * Include the contents of a .gitignore file in ESLint's ignore configuration.
 * @param {string} [gitIgnorePath] - The path to the .gitignore file. If not provided,
 * the .gitignore file in the current working directory will be used.
 * @returns {object} An object that ESLint can use to ignore files.
 */
export const includeGitIgnore = ( gitIgnorePath = resolve( '.gitignore' ) ) => {

	return includeIgnoreFile( gitIgnorePath )

}

/**
 * Set paths to ignore in ESLint.
 * @param {string[]} paths - An array of paths to ignore.
 * @returns {object} - An object with a single property,
 * `ignores`, that is an array of paths to ignore.
 * @example
 * import { setIgnoreConfig } from './ignore.mjs'
 *
 * const paths = [
 * 	'./static/*',
 * 	'./public/*',
 * ]
 *
 * const config = setIgnoreConfig(paths)
 */
export const setIgnoreConfig = paths => ( { ignores : [
	...paths,
	'**/static/*',
	'**/public/*',
] } )
