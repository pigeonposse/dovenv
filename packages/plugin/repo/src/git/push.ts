/**
 * TODO prompt.
 * @description Add prompt for edit project TODO List.
 */

import { exec } from '@dovenv/utils'

import { RepoAdd }    from './add'
import { RepoBranch } from './branch'
import { RepoCommit } from './commit'
import { Git }        from './super'
import { Workflow }   from '../gh/workflow'
import { Packages }   from '../pkg/fn'

export class RepoPush extends Git {

	async exec( branch: string ) {

		await exec( `git push -f origin ${branch}` )

	}

	async run( ) {

		await this.init()

		const defaultBranch  = this.opts.defaultBranch || 'main'
		const branchInstance = new RepoBranch( this.opts, this.config )
		const commitInstance = new RepoCommit( this.opts, this.config )
		const addInstance    = new RepoAdd( this.opts, this.config )

		const data        = {
			update   : 'update',
			add      : 'add',
			origin   : 'origin',
			workflow : 'workflow',
		} as const
		const defaultData = {
			[data.update]   : false,
			[data.add]      : '.',
			[data.origin]   : defaultBranch,
			[data.workflow] : false,
		}
		const cache       = await this._cache( 'push', defaultData )
		const cached      = await cache.get()

		await this.promptLine( {
			outro    : 'Succesfully finished 🌈',
			onCancel : p => {

				p.cancel( 'Canceled 💔' )
				process.exit( 0 )

			},
			list : async p => ( {
				'desc'        : () => p.log.info( this.color.gray.dim( 'Push your repository' ) ),
				[data.update] : async () => await p.confirm( {
					message      : 'Do yo want update version?',
					initialValue : cached[data.update],
				} ),
				'update-res' : async ( { results } ) => {

					if ( !results[data.update] ) return

					const pkg = new Packages( this.opts )
					await pkg.updateVersion()

				},
				[data.add]    : async () => await addInstance.ask( cached[data.add] ),
				[data.origin] : async () => await branchInstance.askSelectBranch( cached[data.origin] || defaultBranch ),
				'add-res'     : async ( { results } ) => {

					if ( results[data.add] && results[data.origin] ) {

						console.log()
						await addInstance.exec( results[data.add] )
						await commitInstance.run()
						await this.exec( results[data.origin] )
						console.log()

						p.log.success( `Successfully pushed to ${this.opts.repoURL}\n` )

					}

				},
				[data.workflow] : async () => await p.confirm( {
					message      : 'Do you want run GitHub workflow?',
					initialValue : cached[data.workflow],
				} ),
				'last' : async ( { results } ) => {

					cache.set( {
						[data.update]   : results[data.update],
						[data.add]      : results[data.add],
						[data.origin]   : results[data.origin],
						[data.workflow] : results[data.workflow],
					} )

					if ( !( results[data.workflow] ) ) return
					const wf = new Workflow( this.opts, this.config )
					await wf.run()

				},
			} ),

		} )

	}

}
