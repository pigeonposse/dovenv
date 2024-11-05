import { exec } from '@dovenv/utils'

import { Repo } from '../_super/main'

export class UpdateVersion extends Repo {

	async run() {

		await exec( 'changeset && changeset version' )

	}

}
