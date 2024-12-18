import { catchError } from '@dovenv/core/utils'

import {
	Contributors,
	type Contributor,
	type Role,
} from './fn'

import type { Config as DovenvConfig } from '@dovenv/core'

export type ContributorsConfig<ID extends string, R extends Role<ID>> = {
	/**
	 * Set contributor roles
	 * @example
	 * {
	 *     owner: { name: 'Owner', emoji: '👑' },
	 *     developer: { name: 'Developer', emoji: '🤝' },
	 *     organization: { name: 'Organization', emoji: '🏢' },
	 *     sponsor: { name: 'Sponsor', emoji: '🤝' },
	 *     translator: { name: 'Translator', emoji: '🌏' }
	 * },
	 */
	role   : R
	/**
	 * Set contributor members
	 * @example
	 * [
	 *     { ghUsername: 'angelespejo', name: 'Angelo', role: 'author' },
	 *     { ghUsername: 'pigeonposse', name: 'PigeonPosse', role: 'organization' },
	 *  ]
	 */
	member : Contributor<Extract<keyof R, string>>[]
}

export const CONTRIBUTOR_ROLE = {
	author : {
		name  : 'Author',
		emoji : '👑',
		desc  : 'Author of the project.',
	},
	developer : {
		name  : 'Developer',
		emoji : '👨‍💻',
		desc  : 'Contributor for the development of the project. Code, docs, etc.',
	},
	designer : {
		name  : 'Designer',
		emoji : '💄',
		desc  : 'Contributor for the design of the project. Images, icons, etc.',
	},
	organization : {
		name  : 'Organization',
		emoji : '🏢',
	},
	sponsor : {
		name  : 'Sponsor',
		emoji : '🤝',
	},
	translator : {
		name  : 'Translator',
		emoji : '🌏',
	},
} satisfies Role

export { Contributors }

export const contributorsPlugin = <ID extends string, R extends Role<ID>> ( conf?: ContributorsConfig<ID, R> ): DovenvConfig => {

	const res: DovenvConfig['custom'] = { contributors : {
		desc : 'Toolkit for workspace contributors',
		cmds : { list : {
			desc : 'List workspace contributors',
			opts : { role : {
				type : 'array',
				desc : 'Contributor role pattern',
			} },
		} },
		fn : async ( {
			cmds, showHelp, opts,
		} ) => {

			const [ error, con ] = await catchError( ( async () => new Contributors( conf ) )() )
			if ( error ) {

				console.error( error.message )
				return

			}
			if ( cmds?.includes( 'list' ) ) {

				if ( opts?.role ) {

					const members = await con.filterByRolePattern( opts.role as string[] )
					await con.showTerminalOutput( members )

				}
				else await con.showTerminalOutput()

			}
			else showHelp()

		},
	} }

	return {
		custom : res,
		const  : conf ? { contributors: conf } : undefined,
	}

}
