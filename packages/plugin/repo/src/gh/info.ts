import { execChild } from '@dovenv/core/utils'

import { GHSuper } from './_super'

export class GitHubInfo extends GHSuper {

	async viewAll() {

		const data = await this.getRepoList()
		if ( data && data.length > 0 )
			console.dir( data, { depth: Infinity } )
		else console.error( 'No data found' )

	}

	async view() {

		const list = await this.getRepoList()
		const data = list.filter( l => l.name === this.opts?.ID )[0]
		if ( data )
			console.dir( data, { depth: Infinity } )
		else console.error( 'No data found' )

	}

	async update() {

		try {

			await this.init()
			await this.initGH()

			const {
				URL: repoURL, homepageURL, tags, desc,
			} = this.opts || {}

			if ( !repoURL )
				return this.prompt.log.warn( this.style.warn.msg( `No repo url provided`, `You need to provide a repo url` ) )

			const homepage    = homepageURL ? `--homepage "${homepageURL}"` : ''
			const topics      = tags ? `--add-topic "${tags}"` : ''
			const description = desc ? `-d "${desc}"` : ''

			const list: [ string, string ][] = [
				[ 'homepage', homepageURL || 'none' ],
				[ 'topics', tags?.join( ', ' ) || 'none' ],
				[ 'description', desc || 'none' ],
			]

			await this.prompt.box( {
				value : `Repo info to update:\n\n${list.map( l => this.style.info.li( ...l ) ).join( '\n' )}\n`,
				opts  : {
					borderStyle : 'none',
					padding     : 0,
					dimBorder   : true,
				},
				type : 'info',
			} )

			if ( homepage || topics || description ) {

				const { stderr } = await execChild( `gh repo edit "${repoURL}" ${homepage} ${topics} ${description}` )

				if ( stderr ) return this.prompt.log.error( this.style.error.msg( 'Error updating repo info', stderr ) )
				else this.prompt.log.success( this.style.success.h( `Updated repo info in` ) + ' ' + this.style.success.p( `${this.style.a( repoURL )}` ) )

			}
			else this.prompt.log.error( this.style.error.msg( 'Nothing to update.' ) )
			this.prompt.log.step( '' )

		}
		catch ( e ) {

			console.error( 'Unexpected error', e )

		}

	}

}

