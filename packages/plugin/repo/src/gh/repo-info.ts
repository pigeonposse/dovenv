import { execChild } from '@dovenv/core/utils'

import { Repo } from '../_super/main'

export class RepoInfo extends Repo {

	async updateInfo() {

		try {

			await this.init()
			await this.initGH()

			const {
				URL: repoURL, homepageURL, tags, desc,
			} = this.opts || {}

			if ( !repoURL ) return console.warn( `No repo url provided. You need to provide a repo url` )
			const homepage    = homepageURL ? `--homepage "${homepageURL}"` : ''
			const topics      = tags ? `--add-topic "${tags}"` : ''
			const description = desc ? `-d "${desc}"` : ''
			if ( homepage || topics || description ) {

				await execChild( `gh repo edit "${repoURL}" ${homepage} ${topics} ${description}` )
				console.log( `✨ Updated repo info in ${repoURL}` )

			}
			else console.warn( 'Nothing to update. Change one of the following keys: homepageURL, repoTags, repoDesc' )

		}
		catch ( e ) {

			console.error( 'Unexpected error', e )

		}

	}

}

