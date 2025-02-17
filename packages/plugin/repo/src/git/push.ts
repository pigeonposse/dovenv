import { exec } from '@dovenv/core/utils'

import { GitSuper }       from './_super'
import { GitAdd }         from './add'
import { GitBranch }      from './branch'
import { GitCommit }      from './commit'
import { GitInit }        from './init'
import { GitHubWorkflow } from '../gh/workflow'
import { Packages }       from '../pkg/fn'

export class GitPush extends GitSuper {

	async exec( branch: string ) {

		const cmd = `git push -f origin ${branch}`

		console.log( this.utils.style.info.hr( cmd ) )
		await exec( cmd )
		console.log( this.utils.style.info.hr(  ) )

	}

	async run( ) {

		await this.init()

		const defaultBranch  = this.opts?.defaultBranch
		const params         = {
			opts  : this.opts,
			utils : this.utils,
		}
		const branchInstance = new GitBranch( params )
		const commitInstance = new GitCommit( params )
		const addInstance    = new GitAdd( params )
		const initInstance   = new GitInit( params )
		const pkgInstance    = new Packages( params )

		await initInstance.run( true )

		const data = {
			staged   : 'staged',
			view     : 'view',
			update   : 'update',
			add      : 'add',
			origin   : 'origin',
			workflow : 'workflow',
		} as const

		const defaultData = {
			[data.staged]   : false,
			[data.view]     : true,
			[data.update]   : false,
			[data.add]      : '.',
			[data.origin]   : defaultBranch,
			[data.workflow] : false,
		}

		const cache  = await this.utils.cache( 'push', defaultData )
		const cached = await cache.get()
		console.debug( 'cached data', cached )

		await this.utils.promptGroup( {
			outro    : `Finished ${this.utils.style.badge( 'push' )} process 🌈`,
			onCancel : async () => await this.utils.onCancel(),
			list     : async p => ( {
				'desc'        : async () => p.log.info( this.utils.style.p( 'Push your repository' ) ),
				[data.staged] : async () => {

					const res = await p.confirm( {
						message      : 'View staged files?',
						initialValue : cached[data.staged],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()

					cache.set( { [data.staged]: res } )
					if ( !res ) return

					const files = await commitInstance.getStagedFiles()
					p.log.message( this.utils.style.p( files ) )
					return res

				},
				[data.view] : async () => {

					const res = await p.confirm( {
						message      : 'View package version(s)?',
						initialValue : cached[data.view],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()

					cache.set( { [data.view]: res } )

					if ( res ) await pkgInstance.showPackageVersion()
					return res

				},
				[data.update] : async () => {

					const res = await p.confirm( {
						message      : 'Update the version(s)?',
						initialValue : cached[data.update],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()

					cache.set( { [data.update]: res } )

					return res

				},
				'update-res' : async ( { results } ) => {

					// @ts-ignore
					if ( !results[data.update] ) return

					await pkgInstance.ask()

				},
				'desc-add'    : async () => p.log.info( this.utils.style.p( 'Prompt for add to repository' ) ),
				[data.add]    : async () => await addInstance.ask( cached[data.add] ),
				[data.origin] : async () => await branchInstance.askSelectBranch( cached[data.origin] || defaultBranch ),
				'add-res'     : async ( { results } ) => {

					const res = {
						// @ts-ignore
						[data.add]    : results[data.add] as string,
						// @ts-ignore
						[data.origin] : results[data.origin] as string,
					}

					cache.set( res )
					if ( res[data.add] && res[data.origin] ) {

						try {

							console.log()
							await addInstance.exec( res[data.add] )
							await commitInstance.run()
							await this.exec( res[data.origin] )
							console.log()

							p.log.success( this.utils.style.success.h( `Successfully pushed to` ) + ' ' + this.utils.style.success.p( `${this.utils.style.a( await this.getGitRemoteURL() || '[no repoURL provided]' )}\n` ) )

						}
						catch ( e ) {

							if ( e instanceof Error )
								p.log.error( e.message )
							await this.utils.onCancel()

						}

					}

				},
				[data.workflow] : async () => {

					const res = await p.confirm( {
						message      : 'Run GitHub workflow?',
						initialValue : cached[data.workflow],
					} )
					if ( p.isCancel( res ) ) return await this.utils.onCancel()

					cache.set( { [data.workflow]: res } )

					return res

				},
				'workflow-res' : async ( { results } ) => {

					// @ts-ignore
					const res = results[data.workflow] as boolean
					if ( !res ) return

					const wf = new GitHubWorkflow( {
						opts  : this.opts,
						utils : this.utils,
					} )
					await wf.run()

				},
			} ),

		} )

	}

}
