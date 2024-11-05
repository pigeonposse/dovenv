import {
	color,
	existsLocalBin,
	joinPath,
} from '@dovenv/utils'

import type { Config } from './types'

export class Repo {

	opts : Config
	constructor( opts?: Config, consts?: Record<string, unknown> ) {

		try {

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pkg          = consts?.pkg && typeof consts?.pkg == 'object' ? consts?.pkg : {} as any
			const workspaceDir = consts?.workspaceDir && typeof consts?.workspaceDir == 'string' ? consts?.workspaceDir : undefined

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
			this.opts = opts || {}

		}
		catch ( e ) {

			console.error( 'Internal Error loading repo config', e )

		}

	}

	async existsLocalGit() {

		return await existsLocalBin( 'git' )

	}

	color = color

}
