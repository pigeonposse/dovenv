import { PackageJSON } from '@dovenv/core/utils'

import { CONTRIBUTOR_ROLE } from './const'

import type { ContributorsOpts } from './types'

const extractGithubUsername = ( input: string ): string => {

	if ( input.includes( 'github.com' ) ) {

		const match = input.match( /github\.com\/([^/]+)/ )
		return match ? match[1] : 'unknown'

	}
	return input.split( '@' )[0] || 'unknown'

}

/**
 * Converts a package's author, contributors, and maintainers information into
 * a structured format of contributors and their roles.
 *
 * @param   {PackageJSON}      pkg    - The package JSON containing author, contributors, and maintainers data.
 * @param   {ContributorsOpts} [opts] - Optional contributors options.
 * @returns {object}                  An object containing:
 *                                    - `role`: An object defining various contributor roles with their names and emojis.
 *                                    - `member`: An array of contributors with details like role, GitHub username, name, and URL.
 */
export const package2Contributors = ( pkg: PackageJSON, opts?: ContributorsOpts ): ContributorsOpts | undefined => {

	if ( !pkg ) throw new Error( 'No package provided' )

	const members: ContributorsOpts['member'] = opts?.member || [ ]

	const role: ContributorsOpts['role'] = {
		author      : CONTRIBUTOR_ROLE.author,
		contributor : CONTRIBUTOR_ROLE.contributor,
		mantainer   : CONTRIBUTOR_ROLE.mantainer,
		...( opts?.role || {} ),
	}

	const sections = {
		contributors : pkg.contributors || [],
		author       : pkg.author ? [ pkg.author ] : [],
		maintainers  : pkg.maintainers || [],
	}

	for ( const [ roleKey, contributors ] of Object.entries( sections ) ) {

		for ( const contributor of contributors ) {

			if ( typeof contributor === 'string' ) {

				members.push( {
					role       : roleKey,
					ghUsername : contributor,
					name       : contributor,
				} )

			}
			else {

				const {
					name, url, email,
				} = contributor
				const ghUsername = extractGithubUsername( url || email || '' )
				members.push( {
					role : roleKey,
					ghUsername,
					name : name || ghUsername,
					url,
				} )

			}

		}

	}

	return members.length
		? {
			role,
			member : members,
		}
		: undefined

}
