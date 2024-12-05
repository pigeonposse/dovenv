import { execChild } from '@dovenv/core/utils'

import { Repo } from '../_super/main'

import type { GitConfig } from './types'

export class GitSuper extends Repo {

	opts : GitConfig
	constructor( opts?: GitConfig, config?: Repo['config'] ) {

		super( opts, config )
		this.opts = opts || {}

	}

	async getGitRemoteURL() {

		return this.opts.repoURL || ( await execChild( 'git remote get-url origin' ) ).stdout || undefined

	}

}
