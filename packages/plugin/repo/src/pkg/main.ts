import { Packages } from './fn'

import type { Config }                 from '../_super/types'
import type { Config as DovenvConfig } from '@dovenv/core'

const CMD = {
	release : 'release',
	publish : 'publish',
	init    : 'init',
	version : 'version',
	prepare : 'prepare',
	ask     : 'ask',
} as const

export { Packages }

export const pkgPlugin = ( conf?: Config ): DovenvConfig => {

	return { custom : { pkg : {
		desc : 'Packages commands: update, publish... (wraps changesets)',
		cmds : {
			[CMD.init]    : { desc: 'Init packages' },
			[CMD.ask]     : { desc: 'Ask for changes' },
			[CMD.prepare] : { desc: 'Preprare version changelog' },
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
			else if ( cmds?.includes( CMD.prepare ) )
				await pkg.prepare()
			else if ( cmds?.includes( CMD.init ) )
				await pkg.init()
			else if ( cmds?.includes( CMD.version ) )
				await pkg.version()
			else if ( cmds?.includes( CMD.ask ) )
				await pkg.ask()
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
