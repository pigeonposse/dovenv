import {
	getPackage,
	getPackageFromName,
	getPackageFromPath,
	getPackageFromUrl,
} from './core'
import { PackageRepoUrlOpts } from './types'

import type {
	PackageContent,
	PackageInput,
	PackageName,
	PackageOpts,
	PackagePath,
	PackageRemoteOpts,
	PackageURL,
} from './types'

import { joinUrl } from '@/string'

/**
 * Retrieves the repository URL from the given package JSON content.
 *
 * If the repository is an object with a 'url' property, and the 'dir' option is true,
 * the directory is appended to the URL.
 *
 * @param   {PackageContent}     input - The package JSON object containing repository information.
 * @param   {PackageRepoUrlOpts} opts  - Options for URL retrieval.
 * @returns {string | undefined}       The sanitized repository URL with optional directory, or undefined if not found.
 * @throws Will throw an error if there is an unexpected error retrieving the URL.
 * @example
 * const pkg = await getPackage('@dovenv/utils') // get package.json object
 * const repoUrl = await getPackageRepoUrlFromContent(pkg)
 * console.log(repoUrl)
 */
export const getPackageRepoUrlFromContent = ( input: PackageContent, opts?: PackageRepoUrlOpts ) => {

	try {

		const sanitizeUrl = ( url: string ) => url.replace( /^git\+/, '' ).replace( /\.git$/, '' )
		return typeof input?.repository === 'object' && 'url' in input.repository && input.repository.url
			? joinUrl( sanitizeUrl( input.repository.url ), opts?.dir === false ? '' : ( input.repository.directory || '' ) )
			: typeof input?.repository === 'string' && input.repository
				? sanitizeUrl( input.repository )
				: undefined

	}
	catch {

		throw new Error( 'Unexpected error getting repository URL' )

	}

}

/**
 * Retrieves the repository URL for a package given its name.
 *
 * This function fetches the package JSON using the package name and extracts
 * the repository URL, optionally appending the directory if specified in the options.
 *
 * @param   {PackageName}                 input  - The name of the package to retrieve the repository URL for.
 * @param   {PackageRepoUrlOpts}          [opts] - Options for URL retrieval, including whether to append the directory.
 * @returns {Promise<string | undefined>}        A promise resolving to the sanitized repository URL with optional directory, or undefined if not found.
 * @throws  Will throw an error if there is an unexpected error retrieving the URL.
 * @example
 * const repoUrl = await getPackageRepoUrlFromName('@dovenv/utils')
 * console.log(repoUrl)
 */
export const getPackageRepoUrlFromName = async ( input: PackageName, opts?: PackageRepoUrlOpts & { pkg?: PackageRemoteOpts } ) => {

	const pkg = await getPackageFromName( input )
	return getPackageRepoUrlFromContent( pkg, opts )

}

/**
 * Retrieves the repository URL for a package given its URL.
 *
 * This function fetches the package JSON using the package URL and extracts
 * the repository URL, optionally appending the directory if specified in the options.
 *
 * @param   {PackageURL}                  input  - The URL of the package to retrieve the repository URL for.
 * @param   {PackageRepoUrlOpts}          [opts] - Options for URL retrieval, including whether to append the directory.
 * @returns {Promise<string | undefined>}        A promise resolving to the sanitized repository URL with optional directory, or undefined if not found.
 * @throws  Will throw an error if there is an unexpected error retrieving the URL.
 * @example
 * const repoUrl = await getPackageRepoUrlFromUrl('https://registry.npmjs.org/@dovenv/utils')
 * console.log(repoUrl)
 */
export const getPackageRepoUrlFromUrl = async ( input: PackageURL, opts?: PackageRepoUrlOpts & { pkg?: PackageRemoteOpts } ) => {

	const pkg = await getPackageFromUrl( input, opts?.pkg )
	return getPackageRepoUrlFromContent( pkg, opts )

}
/**
 * Retrieves the repository URL for a package given its file path.
 *
 * This function fetches the package JSON using the package path and extracts
 * the repository URL, optionally appending the directory if specified in the options.
 *
 * @param   {PackagePath}                 input  - The file path of the package to retrieve the repository URL for.
 * @param   {PackageRepoUrlOpts}          [opts] - Options for URL retrieval, including whether to append the directory.
 * @returns {Promise<string | undefined>}        A promise resolving to the sanitized repository URL with optional directory, or undefined if not found.
 * @throws  Will throw an error if there is an unexpected error retrieving the URL.
 * @example
 * const repoUrl = await getPackageRepoUrlFromPath('./packages/core')
 * console.log(repoUrl)
 */
export const getPackageRepoUrlFromPath = async ( input: PackagePath, opts?: PackageRepoUrlOpts ) => {

	const pkg = await getPackageFromPath( input )
	return getPackageRepoUrlFromContent( pkg, opts )

}

/**
 * Retrieves the repository URL for a package given its path, URL, name, or content.
 *
 * This function takes an input which can be a package path, URL, name, or content,
 * and returns the repository URL, optionally appending the directory if specified in the options.
 *
 * @param   {PackageInput}                input  - The package path, URL, name, or content to retrieve the repository URL for.
 * @param   {PackageRepoUrlOpts}          [opts] - Options for URL retrieval, including whether to append the directory.
 * @returns {Promise<string | undefined>}        A promise resolving to the sanitized repository URL with optional directory, or undefined if not found.
 * @throws  Will throw an error if there is an unexpected error retrieving the URL.
 * @example
 * const repoUrl = await getPackageRepoUrl('./packages/core')
 * console.log(repoUrl)
 *
 * // from npm web
 * const repoUrl = await getPackageRepoUrl('https://www.npmjs.com/package/@dovenv/utils')
 * console.log(repoUrl)
 *
 * // from package name
 * const repoUrl = await getPackageRepoUrl('@dovenv/utils')
 * console.log(repoUrl)
 *
 * // from package content
 * const pkg = await getPackage('@dovenv/utils')
 * const repoUrl = await getPackageRepoUrl(pkg)
 * console.log(repoUrl)
 */
export const getPackageRepoUrl = async ( input: PackageInput, opts?: PackageRepoUrlOpts & { pkg?: PackageOpts } ) => {

	const pkg = await getPackage( input, opts?.pkg )
	return getPackageRepoUrlFromContent( pkg, opts )

}
