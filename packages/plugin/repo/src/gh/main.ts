import { downloadGitHubPath } from '@dovenv/utils'

import { RepoInfo } from './repo-info'
import { Workflow } from './workflow'

import type { Config }                  from '../_super/types'
import type { Config as DoveEnvConfig } from 'dovenv'

const CMD = {
	DOWNLOAD : 'download',
	WORKFLOW : 'workflow',
	REPOINFO : 'repo-info',
} as const

export const config = ( conf?: Config ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { gh : {
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
			},
			[CMD.WORKFLOW] : {
				desc : 'Run or list a workflow',
				opts : { list : {
					desc  : 'List workflows',
					alias : 'l',
				} },
			},
			[CMD.REPOINFO] : { desc: 'Update repo info' },
		},
		fn : async ( {
			cmds, opts, config,
		} ) => {

			if ( cmds?.includes( CMD.DOWNLOAD ) )  {

				if ( opts?.input && opts?.output )
					await downloadGitHubPath( {
						input  : opts.input as string,
						output : opts.output as string,
					} )
				else console.warn( 'You must provide an input and an output. Use --input and --output flags' )

			}
			else {

				if ( cmds?.includes( CMD.WORKFLOW ) ) {

					const wf = new Workflow( conf, config )
					if ( opts?.list ) await wf.list()
					else await wf.run()

				}
				else if ( cmds?.includes( CMD.REPOINFO ) ) {

					const repo = new RepoInfo( conf, config )
					await repo.updateInfo()

				}

			}

		},
	} }
	return { custom: res }

}
