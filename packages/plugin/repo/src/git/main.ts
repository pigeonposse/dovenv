import { color } from '@dovenv/utils'

import { RepoBranch } from './branch'
import { RepoCommit } from './commit'
import { Husky }      from './husky'
import { RepoPull }   from './pull'
import { RepoPush }   from './push'

import type { GitConfig }               from './types'
import type { Config as DoveEnvConfig } from 'dovenv'

export const branch = {
	list         : 'list',
	current      : 'current',
	change       : 'change',
	create       : 'create',
	delete       : 'delete',
	switch       : 'switch',
	createSwitch : 'create-switch',
}
export const CMD = {
	commit : 'commit',
	branch : 'branch',
	push   : 'push',
	pull   : 'pr',
	husky  : 'husky',
}
export const config = ( conf?: GitConfig ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { git : {
		desc : 'Git commands',
		cmds : {
			commit : { desc: 'commit configuration' },
			branch : {
				desc : 'branch configuration',
				opts : {
					[branch.list] : {
						desc : 'List branches',
						type : 'boolean',
					},
					[branch.current] : {
						desc : 'Show current branch',
						type : 'boolean',
					},
					[branch.change] : {
						desc : 'Change branch',
						type : 'string',
					},
					[branch.create] : {
						desc : 'Create branch',
						type : 'string',
					},
					[branch.delete] : {
						desc : 'Delete branch',
						type : 'string',
					},
					[branch.switch] : {
						desc : 'Switch branch',
						type : 'string',
					},
					[branch.createSwitch] : {
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

			const list = ( v:Record<string, string> ) => Object.values( v ).map( v => color.gray.dim.italic( v ) ).join( ', ' )

			if ( cmds?.includes( CMD.commit ) ) {

				const cm = new RepoCommit( conf, config )
				await cm.run( )

			}
			else if ( cmds?.includes( CMD.pull ) ) {

				const pull = new RepoPull( conf, config )
				await pull.run()

			}
			else if ( cmds?.includes( CMD.branch ) ) {

				const br = new RepoBranch( conf, config )
				if ( opts?.list ) await br.showAll()
				else if ( opts?.current ) await br.showCurrent()
				else if ( opts?.change || opts?.change === '' ) await br.change( opts.change as string )
				else if ( opts?.create || opts?.create === '' ) await br.create( opts.create as string )
				else if ( opts?.delete || opts?.delete === '' ) await br.delete( opts.delete as string )
				else if ( opts?.switch || opts?.switch === '' ) await br.switch( opts.switch as string )
				else if ( opts?.[branch.createSwitch] || opts?.[branch.createSwitch] === '' ) await br.createAndSwitch( opts.createAndSwitch as string )
				else console.warn( `No option provided. Use: ${list( branch )}` )

			}
			else if ( cmds?.includes( CMD.push ) ) {

				const push = new RepoPush( conf, config )
				await push.run()

			}
			else if ( cmds?.includes( CMD.husky ) ) {

				const husky = new Husky( conf, config )
				await husky.run( )

			}
			else console.warn( `No option provided. Use: ${list( CMD )}` )

		},
	} }

	return { custom: res }

}
