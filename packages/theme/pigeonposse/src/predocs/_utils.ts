import {
	joinPath,
	type PackageJSON,
} from '@dovenv/core/utils'

export const addExtension = <T extends Record<string, string>, E extends string>( base: T, extension: E ) => {

	return Object.fromEntries(
		Object.entries( base ).map( ( [ key, value ] ) => [ key, `${value}.${extension}` ] ),
	) as { [K in keyof T]: `${T[K]}.${typeof extension}` }

}

export const extractLastTwoPathsSeparately = ( fullPath: string ) => {

	try {

		const parts = fullPath.split( '/' ).filter( Boolean ) // Divide el path en partes
		if ( parts.length < 2 ) return undefined
		return {
			first  : parts[parts.length - 2],
			second : parts[parts.length - 1],
		} // Devuelve los dos últimos niveles como un array

	}
	catch ( _ ) {
		//
	}

}

/**
 * Retrieves the repository name from the package JSON.
 *
 * This function extracts the user and repository identifiers from the package's extra metadata
 * and combines them to form the repository name.
 *
 * @param   {PackageJSON} pkg - The package JSON object containing repository metadata.
 * @returns {string}          The repository name in the format "user/repo". Returns an empty string if
 *                            either user or repo information is missing.
 */

export const getRepoName = ( pkg: PackageJSON ) => {

	const user = pkg.extra?.collective?.id
	const repo = pkg.extra?.repoID || pkg.extra?.repoId
	if ( !user || !repo ) return ''
	return joinPath( user, repo )

}
