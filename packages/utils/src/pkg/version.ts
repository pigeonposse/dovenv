import { getPackage } from './core'

/**
 * Retrieves the version of a package.
 *
 * This function takes an input which can be a package name, URL, or path,
 * and returns the version of the specified package.
 *
 * @param   {Parameters<typeof getPackage>[0]} input - The package identifier (name, URL, or path).
 * @returns {Promise<string>}                        A promise that resolves to the package version.
 * @throws  If the package is not found or an error occurs during retrieval.
 */

export const getPackageVersion = async ( input: Parameters<typeof getPackage>[0] ) => {

	const { version } = await getPackage( input )
	return version

}
