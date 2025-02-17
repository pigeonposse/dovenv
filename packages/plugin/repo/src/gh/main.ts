import { downloadGitHubPath } from '@dovenv/core/utils'

import { GitHubCreate }   from './create'
import { GitHubInfo }     from './info'
import { GitHubWorkflow } from './workflow'

import type { Config as GitHubConfig } from '../_super/types'
import type {
	CommandUtils,
	Config as DovenvConfig,
} from '@dovenv/core'

const CMD       = {
	DOWNLOAD : 'download',
	WORKFLOW : 'workflow',
	INFO     : 'info',
	CREATE   : 'create',
} as const
const CMD_ALIAS = { WORKFLOW: 'wf' }

class GitHub {

	info            : GitHubInfo
	workflow        : GitHubWorkflow
	create          : GitHubCreate
	opts            : GitHubConfig | undefined
	protected utils : CommandUtils

	constructor( {
		opts, utils,
	}:{
		opts? : GitHubConfig
		utils : CommandUtils
	} ) {

		this.opts     = opts
		this.utils    = utils
		this.info     = new GitHubInfo( {
			opts,
			utils,
		} )
		this.workflow = new GitHubWorkflow( {
			opts,
			utils,
		} )
		this.create   = new GitHubCreate( {
			opts,
			utils,
		} )

	}

	async download( input: string, output: string ) {

		return await downloadGitHubPath( {
			input,
			output,
		} )

	}

}

export {
	GitHubWorkflow,
	GitHubInfo,
	GitHubConfig,
	GitHub,
}

export const ghPlugin = ( conf?: GitHubConfig ): DovenvConfig => {

	const res: DovenvConfig['custom'] = { gh : {
		desc : 'GitHub Repo commands and configuration',
		cmds : {
			[CMD.DOWNLOAD] : {
				desc : 'Download a repository or a part of it',
				opts : {
					input : {
						type  : 'string',
						desc  : 'Repository or Repository path to download',
						alias : 'i',
					},
					output : {
						type  : 'string',
						desc  : 'Output directory',
						alias : 'o',
					},
				},
				// examples : [
				// 	{
				// 		desc : 'Download a repository',
				// 		cmd  : '$0 gh download -i https://github.com/pigeonposse/dovenv -o dovenv',
				// 	},
				// ],
			},
			[CMD.CREATE]   : { desc: 'Create a new repo' },
			[CMD.WORKFLOW] : {
				desc : 'Run or list a workflow',
				opts : { list : {
					desc  : 'List workflows',
					alias : 'l',
				} },
			},
			[CMD.INFO] : {
				desc : 'Repo information',
				cmds : {
					update : { desc: 'Update repo info' },
					view   : {
						desc : 'View repo info',
						opts : { all: { desc: 'Show repo info for all repositories' } },
					},
				},
			},
		},
		fn : async ( {
			cmds, opts, utils, showHelp,
		} ) => {

			const gitHub = new GitHub( {
				opts : conf,
				utils,
			} )
			if ( cmds?.includes( CMD.DOWNLOAD ) && opts?.input && opts?.output )
				await gitHub.download( opts.input as string, opts.output as string )
			else if ( cmds?.includes( CMD.WORKFLOW ) || cmds?.includes( CMD_ALIAS.WORKFLOW ) ) {

				if ( opts?.list ) await gitHub.workflow.list()
				else await gitHub.workflow.run()

			}
			else if ( cmds?.includes( CMD.CREATE ) )
				await gitHub.create.run()
			else if ( cmds?.includes( CMD.INFO ) && ( cmds?.includes( 'update' ) || cmds?.includes( 'up' ) ) )
				await gitHub.info.update()
			else if ( cmds?.includes( CMD.INFO ) && cmds?.includes( 'view' ) ) {

				if ( opts?.all ) await gitHub.info.viewAll()
				else await gitHub.info.view()

			}
			else showHelp()

		},
	} }
	return { custom: res }

}
