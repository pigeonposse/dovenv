import {
	line,
	icon,
	catchExecOutput,
} from '@dovenv/core/utils'

import { GitAdd }    from './add'
import { GitBranch } from './branch'
import { GitCommit } from './commit'
import { GitSuper }  from './super'
import { Workflow }  from '../gh/workflow'
import { Packages }  from '../pkg/fn'

export class GitPush extends GitSuper {

	async exec( branch: string ) {

		const cmd = `git push -f origin ${branch}`
		const l   = `\n ${line( {
			title    : this._color.dim( cmd ),
			lineChar : ' ',
		} )}${line( {
			title    : '',
			lineChar : this._color.dim( icon.line ),
		} )}\n`

		console.log( l )
		const [ error, output ] = await catchExecOutput( cmd )
		if ( error ) console.error( this._color.red( error ) )
		else console.log( this._color.dim( output ) )
		console.log( l )

	}

	async run( ) {

		await this.init()

		const defaultBranch  = this.opts.defaultBranch || 'main'
		const branchInstance = new GitBranch( this.opts, this.config )
		const commitInstance = new GitCommit( this.opts, this.config )
		const addInstance    = new GitAdd( this.opts, this.config )

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

		await this._promptLine( {
			outro    : 'Succesfully pushed 🌈',
			onCancel : p => {

				p.cancel( 'Canceled 💔' )
				process.exit( 0 )

			},
			list : async p => ( {
				'desc'        : () => p.log.info( this._color.gray.dim( 'Push your repository' ) ),
				[data.update] : async () => await p.confirm( {
					message      : 'Do yo want update version?',
					initialValue : cached[data.update],
				} ),
				'update-res' : async ( { results } ) => {

					// @ts-ignore
					if ( !results[data.update] ) return

					const pkg = new Packages( this.opts )
					await pkg.release()

				},
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

						console.log()
						await addInstance.exec( res[data.add] )
						await commitInstance.run()
						await this.exec( res[data.origin] )
						console.log()

						p.log.success( `Successfully pushed to ${await this.getGitRemoteURL() || '[no repoURL provided]'}\n` )

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
