import { Packages } from './fn'

import type { Config }                  from '../_super/types'
import type { Config as DoveEnvConfig } from 'dovenv'

const CMD = {
	update  : 'update',
	publish : 'publish',
	init    : 'init',
} as const

export const config = ( conf?: Config ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { pkg : {
		desc : 'Packages commands (update, publish...)',
		cmds : {
			[CMD.update]  : { desc: 'Update version of packages' },
			[CMD.publish] : { desc: 'Publish packages' },
			[CMD.init]    : { desc: 'Init packages' },
		},
		fn : async ( {
			config, cmds,
		} ) => {

			const pkg = new Packages( conf, config )
			if ( cmds?.includes( CMD.update ) )
				await pkg.updateVersion()
			else if ( cmds?.includes( CMD.publish ) )
				await pkg.publish()
			else if ( cmds?.includes( CMD.init ) )
				await pkg.init()
			else console.warn( `No command provided. Use ${Object.values( CMD )}` )

		},
	} }
	return { custom: res }

}
