import { exec } from '@dovenv/core/utils'

import { GHSuper } from './_super'

export class GitHubCreate extends GHSuper {

	async run() {

		await this.init()
		await this.initGH()

		console.log( this.utils.style.info.hr( 'Publish packages' ) )

		await exec( 'gh repo create' )

	}

}
