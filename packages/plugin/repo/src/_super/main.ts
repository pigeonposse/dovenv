import { PluginCore }     from '@dovenv/core'
import {
	existsLocalBin,
	joinPath,
	isGitHubAuthenticated,
} from '@dovenv/core/utils'

import { homepage } from '../../package.json'

import type { Config } from './types'

export class Repo<C extends Config = Config> extends PluginCore<C> {

	title = 'repo'
	protected helpURL = homepage

	protected onInit = () => {

		if ( !this.opts ) this.opts = {} as C

		if ( !this.opts?.homepageURL && this.pkg?.homepage )
			this.opts.homepageURL = this.pkg.homepage

		if ( !this.opts?.tags && this.pkg?.keywords )
			this.opts.tags = this.pkg.keywords

		if ( !this.opts?.desc && this.pkg?.description )
			this.opts.desc = this.pkg.description

		if ( !this.opts?.URL && this.pkg?.repository
			&& typeof this.pkg.repository === 'object'
			&& 'url' in this.pkg.repository && this.pkg.repository.url
		)
			this.opts.URL = this.pkg.repository.url as string

		if ( !this.opts?.workflowsDir && this.wsDir )
			this.opts.workflowsDir = joinPath( this.wsDir, '.github', 'workflows' )

		if ( !this.opts?.ID && this.pkg?.extra && this.pkg.extra.repoID )
			this.opts.ID = this.pkg.extra.repoID

		if ( !this.opts?.userID && this.pkg?.extra && this.pkg.extra.userID )
			this.opts.userID = this.pkg.extra.userID as string

		if ( !this.opts?.URL && this.opts?.ID && this.opts?.userID )
			this.opts.URL = `https://github.com/${this.opts.userID}/${this.opts.ID}`

		if ( !this.opts?.defaultBranch ) this.opts.defaultBranch = 'main'

		console.log( 'On init Repo Config', this.opts )

	}

	protected async _existsLocalGit() {

		return await existsLocalBin( 'git' )

	}

	async initGH() {

		const exitsGHBin = await existsLocalBin( 'gh' )
		if ( !exitsGHBin ) {

			console.warn( 'You must install gh binary for use `gh` commands. See: https://cli.github.com/' )
			return

		}

		const isGhLoggedIn = await isGitHubAuthenticated()
		if ( !isGhLoggedIn ) {

			console.warn( 'You must login to GitHub for use gh commands. Use `gh auth login`.See: https://cli.github.com/manual/gh_auth_login' )
			return

		}

	}

	async init() {

		const git = await this._existsLocalGit()
		if ( !git ) {

			console.warn( 'Git is not installed or not detected.\n Git is required to run this command.\n Please Install git and try again' )
			return

		}

	}

}
