import { execChild } from '@dovenv/utils'

import { Repo } from '../_super/main'

export class RepoInfo extends Repo {

	async updateInfo() {

		try {

			const {
				repoURL, homepageURL, repoTags, repoDesc,
			} = this.opts
			if ( !repoURL ) return console.warn( `No repo url provided. You need to provide a repo url` )
			const homepage    = homepageURL ? `--homepage "${homepageURL}"` : ''
			const topics      = repoTags ? `--add-topic "${repoTags}"` : ''
			const description = repoDesc ? `-d "${repoDesc}"` : ''
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

