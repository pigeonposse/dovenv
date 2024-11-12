import {
	existsPath,
	joinPath,
} from './super/main'

/**
 * Resolves the directory path of a specified module entry.
 * @param {object} opts - An object with options for resolving the module path.
 * @param {string} opts.moduleEntry - The module entry name to resolve, such as a package name.
 * @param {string[]} opts.paths - Optional additional path segments to join with the resolved module directory.
 * @param {string} opts.currentPath - The current path to resolve the module from. Defaults to the current working directory.
 * @returns {string} - The resolved directory path of the module.
 * @throws {Error} If the module cannot be found in the lookup paths.
 * @example
 *
 * const moduleDir = await getModulePath({ moduleEntry: '@dovenv/utils' })
 * console.log(moduleDir) // returns: {workspace}/node_modules/@dovenv/utils
 *
 * const moduleFile = await getModulePath({ moduleEntry: '@dovenv/utils', paths: ['index.js'] })
 * console.log(moduleFile) // returns: {workspace}/node_modules/@dovenv/utils/index.js
 */
export const getModulePath = async ( {
	currentPath = import.meta.url,
	moduleEntry,
	paths,
}:{
	currentPath? : string
	moduleEntry  : string
	paths?       : string[]
} ): Promise<string> => {

	const packageName = moduleEntry.includes( '/' )
		? moduleEntry.startsWith( '@' )
			? moduleEntry.split( '/' ).slice( 0, 2 ).join( '/' )
			: moduleEntry.split( '/' )[0]
		: moduleEntry

	const  module        = await import( 'node:module' )
	const require        = module.default.createRequire( currentPath )
	const resolvedModule = require.resolve.paths( moduleEntry )
	if ( !resolvedModule ) throw new Error( `Module [${moduleEntry}] not found` )
	const lookupPaths = resolvedModule.map( p => joinPath( p, packageName ) )
	let res           = lookupPaths.find( async p => await existsPath( p ) )
	if ( !res ) throw new Error( `Module [${moduleEntry}] not found` )

	if ( paths ) res = joinPath( res, ...paths )

	return res

}
