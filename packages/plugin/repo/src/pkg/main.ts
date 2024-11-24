import { version } from 'os'

import { Packages } from './fn'

import type { Config }                  from '../_super/types'
import type { Config as DoveEnvConfig } from 'dovenv'

const CMD = {
	update  : 'update',
	publish : 'publish',
	init    : 'init',
	version : 'version',
} as const

export { Packages }

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { pkg : {
		desc : 'Packages commands: update, publish... (wraps changesets)',
		cmds : {
			[CMD.init]    : { desc: 'Init packages' },
			[CMD.version] : { desc: 'Update version of packages' },
			[CMD.publish] : { desc: 'Publish packages' },
			[CMD.update]  : { desc: 'Update version and publish packages' },
		},
		fn : async ( {
			config, cmds, showHelp,
		} ) => {

			const pkg = new Packages( conf, config )
			if ( cmds?.includes( CMD.update ) )
				await pkg.updateVersion()
			else if ( cmds?.includes( CMD.publish ) )
				await pkg.publish()
			else if ( cmds?.includes( CMD.init ) )
				await pkg.init()
			else if ( cmds?.includes( CMD.version ) )
				await pkg.version()
			else showHelp()

		},
		examples : [
			{
				cmd  : `$0 pkg ${CMD.update}`,
				desc : 'Directly update version and publish packages',
			},
		],
	} } }

}
