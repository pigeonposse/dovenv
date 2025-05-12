import { color } from '@dovenv/core/utils'

import { GitAdd }    from './add'
import { GitBranch } from './branch'
import { GitCommit } from './commit'
import { Husky }     from './husky'
import { GitInit }   from './init'
import { GitPull }   from './pull'
import { GitPush }   from './push'
import { Repo }      from '../_super/main'

import type { GitConfig }              from './types'
import type { Config as DovenvConfig } from '@dovenv/core'

export {
	GitAdd,
	GitBranch,
	GitCommit,
	Husky,
	GitPull,
	GitPush,
	GitInit,
}

export class Git extends Repo<GitConfig> {

	add        : GitAdd
	branch     : GitBranch
	commit     : GitCommit
	husky      : Husky
	pull       : GitPull
	push       : GitPush
	initialize : GitInit

	constructor( data:{
		opts? : GitConfig
		utils : Repo['utils']
	} ) {

		super( data )
		this.add        = new GitAdd( data )
		this.branch     = new GitBranch( data )
		this.commit     = new GitCommit( data )
		this.husky      = new Husky( data )
		this.pull       = new GitPull( data )
		this.push       = new GitPush( data )
		this.initialize = new GitInit( data )

	}

}

const branch = {
	list         : 'list',
	current      : 'current',
	change       : 'change',
	create       : 'create',
	delete       : 'delete',
	switch       : 'switch',
	createSwitch : 'create-switch',
} as const
const CMD    = {
	add    : 'add',
	commit : 'commit',
	branch : 'branch',
	push   : 'push',
	pull   : 'pr',
	husky  : 'husky',
	init   : 'init',
} as const

export const gitPlugin = ( conf?: GitConfig ): DovenvConfig => {

	const res: DovenvConfig['custom'] = { git : {
		desc : 'Git commands (add, commit, branch, pull, push...)',
		cmds : {
			[CMD.init]   : { desc: 'Initialize git project' },
			[CMD.add]    : { desc: 'Add files to git' },
			[CMD.commit] : { desc: 'Commit configuration' },
			[CMD.branch] : {
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
			[CMD.pull] : { desc: 'Pull request configuration' },
			[CMD.push] : {
				desc : 'Push your code to a branch',
				opts : {
					'skip-update' : {
						desc : 'Skip update',
						type : 'boolean',
					},
					'skip-wf' : {
						desc : 'Skip workflow',
						type : 'boolean',
					},
				},
			},
			[CMD.husky] : { desc: 'Husky configuration' },
		},
		fn : async ( {
			cmds, utils, opts, showHelp,
		} ) => {

			const list = ( v:Record<string, string> ) => Object.values( v ).map( v => color.gray.dim.italic( v ) ).join( ', ' )
			const git  = new Git( {
				opts : conf,
				utils,
			} )
			if ( cmds?.includes( CMD.commit ) ) await git.commit.run( )
			else if ( cmds?.includes( CMD.init ) ) await git.initialize.run( )
			else if ( cmds?.includes( CMD.add ) ) await git.add.run( )
			else if ( cmds?.includes( CMD.pull ) ) await git.pull.run( )
			else if ( cmds?.includes( CMD.branch ) ) {

				if ( opts?.list ) await git.branch.showAll()
				else if ( opts?.current ) await git.branch.showCurrent()
				else if ( opts?.change || opts?.change === '' ) await git.branch.change( opts.change as string )
				else if ( opts?.create || opts?.create === '' ) await git.branch.create( opts.create as string )
				else if ( opts?.delete || opts?.delete === '' ) await git.branch.delete( opts.delete as string )
				else if ( opts?.switch || opts?.switch === '' ) await git.branch.switch( opts.switch as string )
				else if ( opts?.[branch.createSwitch] || opts?.[branch.createSwitch] === '' ) await git.branch.createAndSwitch( opts.createAndSwitch as string )
				else console.warn( `No option provided. Use: ${list( branch )}` )

			}
			else if ( cmds?.includes( CMD.push ) ) await git.push.run( {
				skipUpdate   : opts?.['skip-update'] as boolean,
				skipWorkflow : opts?.['skipWorkflow'] as boolean,
			} )
			else if ( cmds?.includes( CMD.husky ) ) await git.husky.run( )
			else showHelp()

		},
	} }

	return { custom: res }

}
