import { RepoBranch } from './branch'
import { RepoCommit } from './commit'
import { Husky }      from './husky'
import { RepoPush }   from './push'

import type { GitConfig }               from './types'
import type { Config as DoveEnvConfig } from 'dovenv'

export const config = ( conf?: GitConfig ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { git : {
		desc : 'Git commands',
		cmds : {
			commit : { desc: 'commit configuration' },
			branch : {
				desc : 'branch configuration',
				opts : {
					'list' : {
						desc : 'List branches',
						type : 'boolean',
					},
					'current' : {
						desc : 'Show current branch',
						type : 'boolean',
					},
					'change' : {
						desc : 'Change branch',
						type : 'string',
					},
					'create' : {
						desc : 'Create branch',
						type : 'string',
					},
					'delete' : {
						desc : 'Delete branch',
						type : 'string',
					},
					'switch' : {
						desc : 'Switch branch',
						type : 'string',
					},
					'create-and-switch' : {
						desc : 'Create and switch branch',
						type : 'string',
					},
				},
			},
			pull  : { desc: 'Pull request configuration' },
			push  : { desc: 'Push your project to a branch' },
			husky : { desc: 'Husky configuration' },
		},
		fn : async ( {
			cmds, config, opts,
		} ) => {

			if ( cmds?.includes( 'commit' ) ) {

				const cm = new RepoCommit( conf, config )
				await cm.run( )

			}
			else if ( cmds?.includes( 'pull' ) ) {

				console.log( 'pull' )

			}
			else if ( cmds?.includes( 'branch' ) ) {

				const br = new RepoBranch( conf, config )
				if ( opts?.list ) await br.showAll()
				else if ( opts?.current ) await br.showCurrent()
				else if ( opts?.change ) await br.change( opts.change as string )
				else if ( opts?.create ) await br.create( opts.create as string )
				else if ( opts?.delete ) await br.delete( opts.delete as string )
				else if ( opts?.switch ) await br.switch( opts.switch as string )
				else if ( opts?.createAndSwitch ) await br.createAndSwitch( opts.createAndSwitch as string )
				else console.warn( 'No option provided. Use "list", "current", or "change"' )

			}
			else if ( cmds?.includes( 'push' ) ) {

				const push = new RepoPush( conf, config )
				push.run()

			}
			else if ( cmds?.includes( 'husky' ) ) {

				const husky = new Husky( conf, config )
				await husky.run( )

			}
			else console.warn( 'No option provided. Use "commit", "pull", "push", or "husky"' )

		},
	} }
	return { custom: res }

}
