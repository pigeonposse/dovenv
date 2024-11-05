/**
 * TODO prompt.
 * @description Add prompt for edit project TODO List.
 */

import {
	cache as initCache,
	exec,
	promptLine,
} from '@dovenv/utils'

import { Repo }          from '../_super/main'
import { Workflow }      from '../gh/workflow'
import { UpdateVersion } from '../update/update-version'

export class RepoPush extends Repo {

	async run( ) {

		const existsGit = await this.existsLocalGit()
		if ( !existsGit ) {

			console.warn( 'Git is not installed or not detected.\n Git is required to run this command.\n Please Install git and try again' )
			return

		}

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

		const answers = await promptLine( {
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

						await exec( `git add ${results[data.add]} && pnpm cm && git push -f origin ${results[data.origin]}` )

						p.log.success( `Successfully commit to ${this.opts.repoURL}\n` )

					}

				},
				[data.workflow] : () => p.confirm( {
					message      : 'Run workflow?',
					initialValue : cache.get( data.workflow ) as boolean,
				} ),
				'workflow-res' : async ( { results } ) => {

					if ( !( results[data.workflow] ) ) return
					const wf = new Workflow( this.opts )
					await wf.run()

				},
			} ),

		} )

		const {
			// @ts-ignore
			update, add, origin, workflow,
		} = answers

		cache.set( {
			update,
			add,
			origin,
			workflow,
		} )

	}

}
