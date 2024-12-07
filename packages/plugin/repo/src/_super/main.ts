import { PluginCore }     from '@dovenv/core'
import {
	existsLocalBin,
	joinPath,
	isGitHubAuthenticated,
} from '@dovenv/core/utils'

import type { Config }                  from './types'
import type { Config as DoveEnvConfig } from '@dovenv/core'

export class Repo extends PluginCore {

	opts   : Config = {}
	config : DoveEnvConfig = {}

	constructor( opts?: Config, config?: DoveEnvConfig ) {

		super()

		try {

			const consts = config?.const || undefined
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pkg          = consts?.pkg && typeof consts?.pkg == 'object' ? consts?.pkg : {} as any
			const workspaceDir = consts?.workspaceDir && typeof consts?.workspaceDir == 'string' ? consts?.workspaceDir : this.process.cwd()

			if ( !opts?.homepageURL && pkg.homepage ) opts = {
				...opts,
				homepageURL : pkg.homepage as string,
			}

			if ( !opts?.repoTags && pkg.keywords ) opts = {
				...opts,
				repoTags : pkg.keywords as string[],
			}
			if ( !opts?.repoDesc && pkg && pkg.description ) opts = {
				...opts,
				repoDesc : pkg.description as string,
			}
			if ( !opts?.repoURL && pkg.repository && typeof pkg.repository === 'object' && 'url' in pkg.repository && pkg.repository.url ) opts = {
				...opts,
				repoURL : pkg.repository.url as string,
			}
			if ( !opts?.workflowsDir && workspaceDir ) opts = {
				...opts,
				workflowsDir : joinPath( workspaceDir, '.github', 'workflows' ),
			}
			// @ts-ignore
			if ( !opts?.repoID && pkg.extra && pkg.extra.repoID ) opts = {
				...opts,
				// @ts-ignore
				repoID : pkg.extra.repoID as string,
			}
			if ( !opts?.userID && pkg.extra && pkg.extra.userID ) opts = {
				...opts,
				// @ts-ignore
				userID : pkg.extra.userID as string,
			}
			// generate repoURL is is not provided
			if ( !opts?.repoURL && opts?.repoID && opts?.userID ) opts = {
				...opts,
				repoURL : `https://github.com/${opts.userID}/${opts.repoID}`,
			}

			this.opts   = opts || {}
			this.config = config || {}

		}
		catch ( e ) {

			console.error( 'Internal Error loading repo config', e )

		}

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

	// protected async _cache<V extends Record<string, unknown>>( id: string, values: V ) {

	// 	return await cache( {
	// 		projectName : this.opts.repoID || 'dovenv',
	// 		id,
	// 		values      : values,
	// 	} )

	// }

	async init() {

		const git = await this._existsLocalGit()
		if ( !git ) {

			console.warn( 'Git is not installed or not detected.\n Git is required to run this command.\n Please Install git and try again' )
			return

		}

	}

}
