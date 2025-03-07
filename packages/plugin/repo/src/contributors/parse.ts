import type {
	Contributor,
	Role,
} from './fn'
import type { PackageJSON } from '@dovenv/core/utils'

const extractGithubUsername = ( input: string ): string => {
    try {
        const url = new URL(input);
        if (url.hostname === 'github.com') {
            const match = url.pathname.match( /\/([^/]+)/ );
            return match ? match[1] : 'unknown';
        }
    } catch (e) {
        // If input is not a valid URL, fall back to the original logic
        if (input.includes('github.com')) {
            const match = input.match(/github\.com\/([^/]+)/);
            return match ? match[1] : 'unknown';
        }
    }
    return input.split('@')[0] || 'unknown';
}

export const package2Contributors = ( pkg: PackageJSON ): {
	role   : Role
	member : Contributor[]
} => {

	const members: Contributor[] = []
	const role: Role             = {
		author : {
			name  : 'Author',
			emoji : '💼',
		},
		contributor : {
			name  : 'Contributor',
			emoji : '🧑‍💻',
		},
		mantainer : {
			name  : 'Mantainer',
			emoji : '🚧',
		},
	}
	const parts                  = {
		contributors : pkg.contributors || [],
		author       : pkg.author ? [ pkg.author ] : [],
		maintainers  : pkg.maintainers || [],
	}
	for ( let index = 0; index < Object.keys( parts ).length; index++ ) {

		const key = Object.keys( parts )[index] as keyof typeof parts

		parts[key].map( contributor => {

			if ( typeof contributor === 'string' ) {

				members.push( {
					role       : key,
					ghUsername : contributor,
					name       : contributor,
				} )

			}
			else {

				const {
					name,
					url,
					email,
				} = contributor
				const ghUsername = extractGithubUsername( url || email || '' )
				members.push( {
					role : key,
					ghUsername,
					name : name || ghUsername,
					url,
				} )

			}

		} )

	}

	return {
		role,
		member : members,
	}

}
