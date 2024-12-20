import {
	PluginCore,
	type Config as DovenvConfig,
} from '@dovenv/core'
import { downloadGitHubPath } from '@dovenv/core/utils'

import { GitHubCreate }   from './create'
import { GitHubInfo }     from './info'
import { GitHubWorkflow } from './workflow'

import type { Config as GitHubConfig } from '../_super/types'

const CMD = {
	DOWNLOAD : 'download',
	WORKFLOW : 'workflow',
	INFO     : 'info',
	CREATE   : 'create',
} as const

class GitHub extends PluginCore<GitHubConfig> {

	info     : GitHubInfo
	workflow : GitHubWorkflow
	create   : GitHubCreate
	constructor( opts?: GitHubConfig, config?: PluginCore['config'] ) {

		super( opts, config )

		this.info     = new GitHubInfo( opts, config )
		this.workflow = new GitHubWorkflow( opts, config )
		this.create   = new GitHubCreate( opts, config )

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
				examples : [
					{
						desc : 'Download a repository',
						cmd  : '$0 gh download -i https://github.com/pigeonposse/dovenv -o dovenv',
					},
				],
			},
			[CMD.WORKFLOW] : {
				desc : 'Run or list a workflow',
				opts : { list : {
					desc  : 'List workflows',
					alias : 'l',
				} },
			},
			[CMD.INFO] : {
				desc : 'repo info',
				cmds : {
					update : { desc: 'Update repo info' },
					view   : { desc: 'View repo info' },
				},
			},
		},
		fn : async ( {
			cmds, opts, config, showHelp,
		} ) => {

			const gitHub = new GitHub( conf, config )
			if ( cmds?.includes( CMD.DOWNLOAD ) )  {

				if ( opts?.input && opts?.output )
					await gitHub.download( opts.input as string, opts.output as string )
				else console.warn( 'You must provide an input and an output. Use --input and --output flags' )

			}
			else if ( cmds?.includes( CMD.WORKFLOW ) ) {

				if ( opts?.list ) await gitHub.workflow.list()
				else await gitHub.workflow.run()

			}
			else if ( cmds?.includes( CMD.INFO ) && cmds?.includes( 'update' ) )
				await gitHub.info.update()
			else if ( cmds?.includes( CMD.INFO ) && cmds?.includes( 'view' ) )
				await gitHub.info.view()
			else showHelp()

		},
	} }
	return { custom: res }

}
