import { execChild } from '@dovenv/core/utils'

import { GitSuper }  from './_super'
import { GitBranch } from './branch'

export class GitPull extends GitSuper {

	async #createPullRequest( title: string, body: string, branch = 'main', open = false ) {

		try {

			const res = await execChild( `gh pr create --title "${title}" --body "${body}" --base ${branch}${open ? ' --web' : ''}` )
			if ( res.stderr  && res.stderr.trim()  !== '' ) throw new Error( res.stderr )

			this.utils.prompt.log.success( res.stdout )
			return true

		}
		catch ( e ) {

			this.utils.prompt.log.step( '' )
			// @ts-ignore
			const res =  e?.stderr || e?.message
			this.utils.prompt.cancel( 'Error creating pull request:\n\n' + res )
			return false

		}

	}

	async run( ) {

		await this.init()
		await this.initGH()

		const defaultBranch  = this.opts?.defaultBranch
		const branchInstance = new GitBranch( {
			opts  : this.opts,
			utils : this.utils,
		} )
		const data           = {
			title : 'title',
			body  : 'body',
			base  : 'base',
			open  : 'open',
		} as const
		const defaultData    = {
			[data.title] : '',
			[data.body]  : '',
			[data.base]  : defaultBranch,
			[data.open]  : false,
		}
		const cache          = await this.utils.cache( 'pull', defaultData )
		const cached         = await cache.get()
		console.debug( 'cached data', cached )
		await this.utils.promptGroup( {
			outro    : `Finished ${this.utils.style.badge( 'pull' )} process 🌈`,
			onCancel : async () => this.utils.onCancel(),
			list     : async p => ( {
				desc         : () => p.log.info( this.utils.style.p( 'Create a pull request on GitHub.' ) ),
				[data.title] : async () => {

					const res = await p.text( {
						message      : 'Title of pull request',
						placeholder  : cached[data.title],
						initialValue : cached[data.title],
						validate     : value => {

							if ( value.length === 0 ) return 'Body can not be empty.'

						},
					} ) as string

					cache.set( { [data.title]: res } )
					return res

				},
				[data.body] : async () => {

					const res = await p.text( {
						message      : 'Body of pull request',
						placeholder  : cached[data.body],
						initialValue : cached[data.body],
						validate     : value => {

							if ( value.length === 0 ) return 'Body can not be empty.'
							else if ( value.length > 50 ) return 'Body can not be longer than 50 characters.'

						},
					} ) as string

					cache.set( { [data.body]: res } )
					return res

				},
				[data.base] : async () => {

					const res = await branchInstance.askSelectBranch( cached[data.base] || defaultBranch )
					cache.set( { [data.base]: res } )
					return res

				},
				[data.open] : async () => {

					const res = await p.confirm( {
						message      : 'Open pull request in browser?',
						initialValue : cached[data.open],
					} ) as boolean

					cache.set( { [data.open]: res } )
					return res

				},
				run : async ( { results } ) => {

					// @ts-ignore
					const res = await this.#createPullRequest( results[data.title], results[data.body], results[data.base], results[data.open]  )
					if ( !res ) this.utils.process.exit( 0 )

				},
			} ),
		} )

	}

}
