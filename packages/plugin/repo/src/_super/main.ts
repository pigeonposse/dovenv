import {
	color,
	existsLocalBin,
	joinPath,
	promptLineProps,
	promptLine,
	process,
} from '@dovenv/utils'

import type { Config }                  from './types'
import type { Config as DoveEnvConfig } from 'dovenv'

export class Repo {

	opts   : Config
	config : DoveEnvConfig

	protected color = color
	protected prompt = promptLineProps
	protected promptLine = promptLine
	protected process = process
	
	constructor( opts?: Config, config?: DoveEnvConfig ) {

		try {

			const consts = config?.const || undefined
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
			this.opts   = opts || {}
			this.config = config || {}

		}
		catch ( e ) {

			console.error( 'Internal Error loading repo config', e )

		}

	}

	protected async existsLocalGit() {

		return await existsLocalBin( 'git' )

	}

	async init() {

		const git = await this.existsLocalGit()
		if ( !git ) {

			console.warn( 'Git is not installed or not detected.\n Git is required to run this command.\n Please Install git and try again' )
			return

		}

	}

}
