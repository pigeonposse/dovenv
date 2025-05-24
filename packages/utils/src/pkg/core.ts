
import { getPackageRepoUrlFromContent } from './repo'

import type {
	PackageContent,
	PackageData,
	PackageInput,
	PackageName,
	PackageOpts,
	PackagePath,
	PackageRemoteOpts,
	PackageURL,
} from './types'

import {
	getObjectFromJSONFile,
	getObjectFromUrl,
} from '@/object'
import {
	getStringType,
	joinUrl,
} from '@/string'
import {
	getBaseName,
	getDirName,
	joinPath,
	resolvePath,
	existsFile,
} from '@/sys'

/**
 * Retrieves a package from the npm registry.
 *
 * @param   {PackageName}       input  - The name of the package you want to retrieve.
 * @param   {PackageRemoteOpts} [opts] - Options object.
 * @returns {object}                   The package object.
 * @throws If the package is not found.
 * @example
 * const pkg = await getPackageFromName('@dovenv/utils')
 * console.log(pkg)
 */
export const getPackageFromName = async ( input: PackageName, opts?: PackageRemoteOpts ): Promise<PackageContent> => {

	const registry = opts?.registry || 'https://registry.npmjs.org'
	const res      = await getObjectFromUrl<{
		'dist-tags' : { latest: string }
		'versions'  : { [key in string]: PackageContent }
	}>(
		joinUrl( registry, input.toLowerCase() ),
	)

	return res['versions'][
		opts?.version
			? opts.version
			: res['dist-tags']['latest']
	]

}

/**
 * Retrieves a package from the npm registry.
 *
 * If the input is a URL, it extracts the package name from the path.
 * If the path starts with '/package/', the package name is the next part of the path.
 * Otherwise, the package name is the first part of the path.
 *
 * @param   {PackageURL}        input  - The name or URL of the package you want to retrieve.
 * @param   {PackageRemoteOpts} [opts] - Options object.
 * @returns {object}                   The package object.
 * @throws If the package is not found.
 * @example
 * const pkg = await getPackageFromUrl('https://registry.npmjs.org/@dovenv/utils')
 * console.log(pkg)
 *
 * // from npm web
 * const pkg = await getPackageFromUrl('https://www.npmjs.com/package/backan?activeTab=code')
 * console.log(pkg)
 */
export const getPackageFromUrl = async ( input: PackageURL, opts?: PackageRemoteOpts ): Promise<PackageContent> => {

	if ( typeof input === 'string' ) input = new URL( input )
	const pathname = input.pathname
	const parts    = pathname.split( '/' ).filter( Boolean )

	const pkgName = ( parts[0] === 'package' && parts[1] ? parts.slice( 1 ) : parts ).join( '/' )

	return await getPackageFromName( pkgName, opts )

}

/**
 * Returns the path to the package.json file for the given package path.
 *
 * If the given path is a directory, it appends 'package.json' to the path.
 * If the given path is a file, it returns the path as is.
 *
 * @param   {PackagePath} input - The path to the package. Supports directory paths or package.json file paths.
 * @returns {string}            The path to the package.json file.
 * @example
 * const pkgJsonPath = getPackageJsonPath('./packages/core/package.json')
 * console.log(pkgJsonPath)
 *
 * // from directory
 * const pkgJsonPath = getPackageJsonPath('./packages/core')
 * console.log(pkgJsonPath)
 */
export const getPackageJsonPath = ( input: PackagePath ) => {

	return joinPath( getDirName( input ), 'package.json' )

}

/**
 * Retrieves a package from a local file path.
 *
 * @param   {PackagePath} input - The path to the package. Supoorts directory paths or package.json file paths.
 * @returns {object}            The package object.
 * @throws If the package is not found.
 * @example
 * const pkg = await getPackageFromPath('./packages/core/package.json')
 * console.log(pkg)
 *
 * // from directory
 * const pkg = await getPackageFromPath('./packages/core')
 * console.log(pkg)
 */
export const getPackageFromPath = async ( input: PackagePath ): Promise<PackageContent> => {

	return await getObjectFromJSONFile<PackageContent>( getPackageJsonPath( input ) )

}

/**
 * Retrieves a package from either a file specified by path, a URL, or a package name.
 *
 * If the input is a URL, it retrieves the package from the npm registry.
 * If the input is a path, it retrieves the package from the file at the path or the package.json file in the directory.
 * If the input is a string, it retrieves the package from the npm registry with the given package name.
 *
 * @param   {PackageInput} input  - The package name, URL, or path to the package.
 * @param   {PackageOpts}  [opts] - Options object.
 * @returns {object}              The package object.
 * @throws If the package is not found.
 * @example
 * const pkg = await getPackage('@dovenv/core')
 * console.log(pkg)
 *
 * // from npm web
 * const pkg = await getPackage('https://www.npmjs.com/package/@dovenv/core')
 * console.log(pkg)
 *
 * // from directory
 * const pkg = await getPackage('./packages/core')
 * console.log(pkg)
 */
export const getPackage = async ( input: PackageInput, opts?: PackageOpts ): Promise<PackageContent> => {

	if ( typeof input === 'object' ) return input
	if ( typeof input !== 'string' ) return await getPackageFromUrl( input, opts?.remote )
	const type = getStringType( input )

	if ( type === 'url' ) return await getPackageFromUrl( input, opts?.remote )
	else if ( type === 'path' ) return await getPackageFromPath( input )
	else return await getPackageFromName( input, opts?.remote )

}

export const getPackageDataFromPath = async ( input: PackagePath ): Promise<PackageData> => {

	const pkg = await getPackageFromPath( input )
	return {
		id          : pkg.name || getBaseName( input ),
		packagePath : getPackageJsonPath( input ),
		dir         : getDirName( input ),
		repoUrl     : getPackageRepoUrlFromContent( pkg ),
		content     : pkg,
	}

}

/**
 * Finds the closest package.json by traversing up the directory tree.
 *
 * @param   {string} [startDir] - Directory to start searching from.
 * @returns {string}            Absolute path to the closest package.json.
 * @throws {Error} If no package.json is found.
 */
export const getClosestPackageJsonPath = async ( startDir = './' ) => {

	let currentDir = resolvePath( startDir )

	while ( true ) {

		const pkgPath = joinPath( currentDir, 'package.json' )

		if ( await existsFile( pkgPath ) ) return pkgPath

		const parentDir = getDirName( currentDir )

		if ( parentDir === currentDir )
			throw new Error( 'No package.json found in any parent directory.' )

		currentDir = parentDir

	}

}

/**
 * Finds the closest package directory by traversing up the directory tree.
 *
 * @param   {string} [startDir] - Directory to start searching from.
 * @returns {string}            Absolute path to the closest package directory.
 */
export const getClosestPackageDir = async ( startDir = './' ) => {

	const pkgPath = await getClosestPackageJsonPath( startDir )
	return getDirName( pkgPath )

}
