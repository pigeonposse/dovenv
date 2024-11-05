/**
 * TODO prompt.
 * @description Add prompt for edit project TODO List.
 */

import {
	cache as initCache,
	exec,
} from '@dovenv/utils'

import { RepoCommit }    from './commit'
import { Repo }          from '../_super/main'
import { Workflow }      from '../gh/workflow'
import { UpdateVersion } from '../update/update-version'

export class RepoPush extends Repo {

	async run( ) {

		await this.init()

		const data          = {
			update   : 'update',
			add      : 'add',
			origin   : 'origin',
			workflow : 'workflow',
		}
		const defaultBranch = this.opts.defaultBranch || 'main'
		const cache         = await initCache( {
			projectName : 'dovenv',
			id          : 'push',
			values      : {
				[data.update]   : false,
				[data.add]      : '.',
				[data.origin]   : defaultBranch,
				[data.workflow] : false,
			},
		} )

		await this.promptLine( {
			outro    : 'Succesfully finished 🌈',
			onCancel : p => {

				p.cancel( 'Canceled 💔' )
				process.exit( 0 )

			},
			list : async p => ( {
				'desc'        : () => p.log.info( this.color.gray.dim( 'Prompt for run workflow' ) ),
				[data.update] : () => p.confirm( {
					message      : 'Do yo want update version?',
					initialValue : cache.get( data.update ) as boolean,
				} ),
				'update-res' : async ( { results } ) => {

					if ( !results[data.update] ) return

					const ver = new UpdateVersion( this.opts )
					await ver.run()

				},
				[data.add] : () => p.text( {
					message      : 'Git add',
					placeholder  : '.',
					initialValue : cache.get( data.add ) as string,
				} ),
				[data.origin] : () => p.text( {
					message      : 'Add origin branch',
					placeholder  : defaultBranch,
					initialValue : cache.get( data.origin ) as string,
				} ),
				'add-res' : async ( { results } ) => {

					if ( results[data.add] && results[data.origin] ) {

						console.log()
						await exec( `git add ${results[data.add]}` )
						const cm = new RepoCommit( this.opts, this.config )
						await cm.run()
						await exec( `git push -f origin ${results[data.origin]}` )
						console.log()

						p.log.success( `Successfully commit to ${this.opts.repoURL}\n` )

					}

				},
				[data.workflow] : () => p.confirm( {
					message      : 'Run workflow?',
					initialValue : cache.get( data.workflow ) as boolean,
				} ),
				'last' : async ( { results } ) => {

					const {
						// @ts-ignore
						update, add, origin, workflow,
					} = results || {}

					cache.set( {
						update,
						add,
						origin,
						workflow,
					} )
					if ( !( results[data.workflow] ) ) return
					const wf = new Workflow( this.opts, this.config )
					await wf.run()

				},
			} ),

		} )

	}

}
