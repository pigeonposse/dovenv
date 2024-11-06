import { formatHTMLForTerminal } from '@dovenv/utils'

import {
	contributorsToHtml,
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

export const config = <ID extends string, R extends Role<ID>> ( conf?: Config<ID, R> ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { contributors : {
		desc : 'Contributors configuration',
		cmds : { list: { desc: 'List contributors' } },
		fn   : async ( { cmds } ) => {

			if ( cmds?.includes( 'list' ) ) {

				if ( conf?.member && conf.role ) {

					// console.log( 'Contributors:' )
					console.log( await formatHTMLForTerminal( `<h1>Contributors</h1>\n\n` + contributorsToHtml( conf.role, conf.member ) ) )

				}
				else console.warn( 'No members or roles provided' )

			}
			else console.warn( 'No option provided. Use "list" to list contributors' )

		},
	} }

	return {
		custom : res,
		const  : conf ? { contributors: conf } : undefined,
	}

}
