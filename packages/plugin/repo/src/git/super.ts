import { Repo } from '../_super/main'

import type { GitConfig } from './types'

export class Git extends Repo {

	opts : GitConfig
	constructor( opts?: GitConfig, config?: Repo['config'] ) {

		super( opts, config )
		this.opts = opts || {}

	}

}
