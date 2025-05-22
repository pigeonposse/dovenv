import { Contributors } from './core'
import { DovenvConfig } from '../_super/types'

import type {
	ContributorsConfig,
	Role,
} from './types'

/**
 * Dovenv plugin for managing workspace contributors.
 *
 * @param   {ContributorsConfig} [conf] - Optional configuration.
 * @returns {DovenvConfig}              - The plugin configuration.
 */
export const contributorsPlugin = <R extends Role = Role>( conf?: ContributorsConfig<R> ): DovenvConfig => {

	return {
		const  : conf ? { contributors: conf } : undefined,
		custom : { contributors : {
			desc : 'Toolkit for workspace contributors',
			cmds : { list : {
				desc : 'List workspace contributors',
				opts : { role : {
					type : 'array',
					desc : 'Contributor role pattern',
				} },
			} },
			fn : async ( {
				cmds, showHelp, opts, utils,
			} ) => {

				const con =  new Contributors<Role>( {
					opts : conf,
					utils,
				} )

				if ( cmds?.includes( 'list' ) ) {

					if ( opts?.role ) {

						const members = await con.filterByRolePattern( opts.role as string[] )
						await con.showTerminalOutput( {
							...members,
							content : { image: false },
						} )

					}
					else await con.showTerminalOutput( { content: { image: false } } )

				}
				else showHelp()

			},
		} },
	}

}
