import { catchError } from '@dovenv/utils'

import {
	Contributors,
	type Contributor,
	type Role,
} from './fn'

import type { Config as DoveEnvConfig } from 'dovenv'

export type Config<ID extends string, R extends Role<ID>> = {
	/**
	 * Set contributor roles
	 * @example
	 * {
	 *     owner: { name: 'Owner', emoji: '👑' },
	 *     author: { name: 'Author', emoji: '👨‍💻' },
	 *     dev: { name: 'Developer', emoji: '🤝' },
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
export { Contributors }
export const config = <ID extends string, R extends Role<ID>> ( conf?: Config<ID, R> ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { contributors : {
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
