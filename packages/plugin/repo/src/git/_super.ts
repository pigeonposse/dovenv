import { execChild } from '@dovenv/core/utils'

import { Repo } from '../_super/main'

import type { GitConfig } from './types'

export class GitSuper extends Repo<GitConfig> {

	async getGitRemoteURL() {

		return this.opts?.URL || ( await execChild( 'git remote get-url origin' ) ).stdout || undefined

	}

}
