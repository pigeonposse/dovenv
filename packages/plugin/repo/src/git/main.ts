import { RepoCommit } from './commit'
import {
	runHusky,
	type HuskyConfig,
} from './husky'
import { RepoPush } from './push'

import type { CommitConfig }            from './commit'
import type { Config }                  from '../_super/types'
import type { Config as DoveEnvConfig } from 'dovenv'

export type GitConfig = {
	commit? : CommitConfig
	pull?   : unknown
	push?   : unknown
	husky?  : HuskyConfig
}

export const config = ( conf?: Config & GitConfig ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { git : {
		desc : 'Git commands',
		cmds : {
			commit : { desc: 'commit configuration' },
			pull   : { desc: 'Make a pull request' },
			push   : { desc: 'Push your project to a branch' },
			husky  : { desc: 'Husky configuration' },
		},
		fn : async ( {
			cmds, config,
		} ) => {

			if ( cmds?.includes( 'commit' ) ) {

				const cm = new RepoCommit( conf )
				await cm.run( )

			}
			else if ( cmds?.includes( 'pull' ) ) {

				console.log( 'pull' )

			}
			else if ( cmds?.includes( 'push' ) ) {

				const push = new RepoPush( conf, config?.const )
				push.run()

			}
			else if ( cmds?.includes( 'husky' ) ) {

				await runHusky( conf?.husky )

			}
			else console.warn( 'No option provided. Use "commit", "pull", "push", or "husky"' )

		},
	} }
	return { custom: res }

}
