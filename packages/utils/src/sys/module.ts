import { process } from '../process/main'
import {
	existsPath,
	joinPath,
} from './super/main'

/**
 * Resolves the directory path of a specified module entry.
 * @param {object} opts - An object with options for resolving the module path.
 * @param {string} opts.id - The module entry name to resolve, such as a package name.
 * @param {string[]} opts.path - Optional additional path segments to join with the resolved module directory.
 * @param {string} opts.from - The path to resolve the module from. Defaults to the current working directory.
 * @returns {string} - The resolved directory path of the module.
 * @throws {Error} If the module cannot be found in the lookup paths.
 * @example
 *
 * const moduleDir = await getModulePath({ id: '@dovenv/utils' })
 * console.log(moduleDir) // returns: {workspace}/node_modules/@dovenv/utils
 *
 * const moduleFile = await getModulePath({ id: '@dovenv/utils', path: ['dist','main.mjs'] })
 * console.log(moduleFile) // returns: {workspace}/node_modules/@dovenv/utils/index.js
 */
export const getModulePath = async ( {
	from = process.cwd(),
	id,

	path,
}:{
	/**
	 * The path to resolve the module from.
	 * @default process.cwd()
	 */
	from? : string
	/** The module entry name to resolve, such as a package name*/
	id    : string
	/** Optional additional path segments to join with the resolved module directory. */
	path? : string[]
} ): Promise<string> => {

	const ModuleError = class extends Error {}
	try {

		const moduleEntry = id

		const packageName    = moduleEntry.includes( '/' )
			? moduleEntry.startsWith( '@' )
				? moduleEntry.split( '/' ).slice( 0, 2 ).join( '/' )
				: moduleEntry.split( '/' )[0]
			: moduleEntry
		const errorMsg       = `Module [${joinPath( moduleEntry, ...( path || [] ) )}] not found. `
		const module         = await import( 'node:module' )
		const require        = module.default.createRequire( from )
		const resolvedModule = require.resolve.paths( moduleEntry )
		if ( !resolvedModule ) throw new ModuleError( errorMsg + 'Failed in resolve.paths' )

		const lookupPaths = resolvedModule.map( p => joinPath( p, packageName ) )
		let res           = lookupPaths.find( async p => await existsPath( p ) )
		if ( !res ) throw new ModuleError( errorMsg +  'Failed in lookupPaths' )

		if ( path ) res = joinPath( res, ...path )
		if ( !await existsPath( res ) ) throw new ModuleError( errorMsg + 'Path does not exist' )
		return res

	}
	catch ( e ) {

		const eInfo = `\nError information:\n\n - Make sure the package [${id}] is installed correctly.`
		if ( e instanceof ModuleError ) {

			e.message += eInfo
			throw e

		}
		throw new Error( `It could not be located ${joinPath( id, ...( path || [] ) )}.` + eInfo )

	}

}
