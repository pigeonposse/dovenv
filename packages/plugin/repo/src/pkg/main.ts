import { Packages } from './fn'

import type { Config }                  from '../_super/types'
import type { Config as DoveEnvConfig } from '@dovenv/core'

const CMD = {
	release : 'release',
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
			[CMD.release] : { desc: 'Update version and publish packages' },
		},
		fn : async ( {
			config, cmds, showHelp,
		} ) => {

			const pkg = new Packages( conf, config )
			if ( cmds?.includes( CMD.release ) )
				await pkg.release()
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
				cmd  : `$0 pkg ${CMD.release}`,
				desc : 'Directly update version and publish packages',
			},
		],
	} } }

}
