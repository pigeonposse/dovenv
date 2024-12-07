import { exec } from '@dovenv/core/utils'

import { GitAdd }    from './add'
import { GitBranch } from './branch'
import { GitCommit } from './commit'
import { GitSuper }  from './super'
import { Workflow }  from '../gh/workflow'
import { Packages }  from '../pkg/fn'

export class GitPush extends GitSuper {

	async exec( branch: string ) {

		const cmd = `git push -f origin ${branch}`

		console.log( this.style.get.line( cmd ) )
		await exec( cmd )
		console.log( this.style.get.line(  ) )

	}

	async run( ) {

		await this.init()

		const defaultBranch  = this.opts.defaultBranch || 'main'
		const branchInstance = new GitBranch( this.opts, this.config )
		const commitInstance = new GitCommit( this.opts, this.config )
		const addInstance    = new GitAdd( this.opts, this.config )

		const data = {
			staged   : 'staged',
			update   : 'update',
			add      : 'add',
			origin   : 'origin',
			workflow : 'workflow',
		} as const

		const defaultData = {
			[data.staged]   : false,
			[data.update]   : false,
			[data.add]      : '.',
			[data.origin]   : defaultBranch,
			[data.workflow] : false,
		}

		const cache  = await this.cache( 'push', defaultData )
		const cached = await cache.get()

		await this.promptGroup( {
			outro    : 'Succesfully pushed 🌈',
			onCancel : async () => await this.onCancel(),
			list     : async p => ( {
				'desc'        : () => p.log.info( this.style.get.text( 'Push your repository' ) ),
				[data.staged] : async () => await p.confirm( {
					message      : 'Do yo want see staged files?',
					initialValue : cached[data.staged],
				} ),
				'staged-res' : async ( { results } ) => {

					// @ts-ignore
					if ( !results[data.staged] ) return

					console.log( this.style.get.line( 'Staged files' ) )
					console.log( await commitInstance.getStagedFiles() )
					console.log( this.style.get.line(  ) )

				},
				[data.update] : async () => await p.confirm( {
					message      : 'Do yo want update version?',
					initialValue : cached[data.update],
				} ),
				'update-res' : async ( { results } ) => {

					// @ts-ignore
					if ( !results[data.update] ) return

					const pkg = new Packages( this.opts )
					await pkg.ask()

				},
				'desc-add'    : () => p.log.info( this.style.get.text( 'Prompt for add to repository' ) ),
				[data.add]    : async () => await addInstance.ask( cached[data.add] ),
				[data.origin] : async () => await branchInstance.askSelectBranch( cached[data.origin] || defaultBranch ),
				'add-res'     : async ( { results } ) => {

					const res = {
						// @ts-ignore
						[data.add]    : results[data.add] as string,
						// @ts-ignore
						[data.origin] : results[data.origin] as string,
					}
					if ( res[data.add] && res[data.origin] ) {

						try {

							console.log()
							await addInstance.exec( res[data.add] )
							await commitInstance.run()
							await this.exec( res[data.origin] )
							console.log()

							p.log.success( this.style.get.succed( `✨ Successfully pushed to ${this.style.get.link( await this.getGitRemoteURL() || '[no repoURL provided]' )}\n` ) )

						}
						catch ( e ) {

							if ( e instanceof Error )
								p.log.error( e.message )
							await this.onCancel()

						}

					}

				},
				[data.workflow] : async () => await p.confirm( {
					message      : 'Do you want run GitHub workflow?',
					initialValue : cached[data.workflow],
				} ),
				'last' : async ( { results } ) => {

					const res = {
						// @ts-ignore
						[data.add]      : results[data.add] as string,
						// @ts-ignore
						[data.origin]   : results[data.origin] as string,
						// @ts-ignore
						[data.update]   : results[data.update] as boolean,
						// @ts-ignore
						[data.workflow] : results[data.workflow] as boolean,
					}
					cache.set( res )

					if ( !( res[data.workflow] ) ) return
					const wf = new Workflow( this.opts, this.config )
					await wf.run()

				},
			} ),

		} )

	}

}
