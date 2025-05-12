
import {
	createBadgeURL,
	createMdLinks,
	getCurrentDir,
	getObjectFromJSONFile,
	joinPath,
	process,
} from '@dovenv/core/utils'

import type { ConstsConfig } from './const'
import type { PackageJSON }  from '@dovenv/core/utils'

type SocialLinks = {
	web?       : string
	about?     : string
	donate?    : string
	github?    : string
	twitter?   : string
	instagram? : string
	medium?    : string
}
type WsOpts = {
	/** URL of the current module */
	metaURL? : string
	/** Relative path to: `process.cwd()` or directory [metaURL] if provided */
	path?    : string
}
type WorkspaceParams = WsOpts & {
	/**
	 * @deprecated
	 */
	core?         : WsOpts
	/**
	 * @deprecated
	 */
	packages?     : WsOpts
	/**
	   Relative to workspace dir.
	 */
	corePath?     : string
	/**
	 * Relative to workspace dir.
	 *
	 * @default
	 * join(workspaceDir, 'packages')
	 */
	packagesPath? : string
}
/**
 * Get the workspace configuration.
 *
 * @param   {WorkspaceParams}                     [opts]         - The options for getting the workspace configuration.
 * @param   {string}                              [opts.metaURL] - The URL of the current module.
 * @param   {string}                              [opts.path]    - The path to the workspace.
 * @param   {{ metaURL?: string, path?: string }} [opts.core]    - The options for the core package.
 * @returns {Promise<ConstsConfig>}                              The workspace configuration.
 */
export const getWorkspaceConfig = async ( {
	path = '',
	metaURL = import.meta.url,
	core,
	packages,
	corePath,
	packagesPath,
}: WorkspaceParams ): Promise<ConstsConfig> => {

	const workspaceDir = joinPath( getCurrentDir( metaURL ) || process.cwd(), path )
	const pkg          = await getObjectFromJSONFile<PackageJSON>( joinPath( workspaceDir, 'package.json' ) )

	const res = {
		pkg,
		workspaceDir,
		corePkg     : pkg,
		coreDir     : workspaceDir,
		packagesDir : joinPath( workspaceDir, 'packages' ),
	}

	if ( packagesPath ) res.packagesDir = joinPath( res.workspaceDir, packagesPath )
	if ( corePath ) {

		res.coreDir = joinPath( res.workspaceDir, corePath )
		res.corePkg = await getObjectFromJSONFile<PackageJSON>( joinPath( res.coreDir, 'package.json' ) )

	}

	if ( core ) {

		console.warn( 'The [core] parameter is deprecated. Please replace it with the [corePath] parameter.' )
		if ( core.metaURL ) res.coreDir = joinPath( getCurrentDir( core.metaURL ), core.path || '' )
		res.corePkg = await getObjectFromJSONFile<PackageJSON>( joinPath( res.coreDir, 'package.json' ) )

	}

	if ( packages ) {

		console.warn( 'The [packages] parameter is deprecated. Please replace it with the [packagesPath] parameter.' )
		if ( packages.metaURL ) res.packagesDir = joinPath( getCurrentDir( packages.metaURL ), packages.path || '' )

	}

	return res

}

/**
 * Generates markdown links for social badges.
 *
 * @param   {SocialLinks}      data - The social links data.
 * @returns {string|undefined}      The generated markdown links or undefined if no links are provided.
 */
export const socialBadges = ( data: SocialLinks ) => {

	const badges = [
		{
			name   : 'Web',
			URL    : data.web,
			imgURL : 'badge/Web-grey',
		},
		{
			name   : 'About Us',
			URL    : data.about,
			imgURL : 'badge/About%20Us-grey',
		},
		{
			name   : 'Donate',
			URL    : data.donate,
			imgURL : 'badge/Donate-pink',
		},
		{
			name   : 'Github',
			URL    : data.github,
			imgURL : 'badge/Github-black',
			logo   : 'github',
		},
		{
			name   : 'Twitter',
			URL    : data.twitter,
			imgURL : 'badge/Twitter-black',
			logo   : 'twitter',
		},
		{
			name   : 'Instagram',
			URL    : data.instagram,
			imgURL : 'badge/Instagram-black',
			logo   : 'instagram',
		},
		{
			name   : 'Medium',
			URL    : data.medium,
			imgURL : 'badge/Medium-black',
			logo   : 'medium',
		},
	]
		.filter( b => b.URL !== undefined )
		.map( badge => ( {
			...badge,
			imgURL : createBadgeURL( {
				path      : badge.imgURL,
				style     : 'for-the-badge',
				logoColor : 'white',
				logo      : badge.logo,
			} ),
		} ) )

	if ( badges && badges.length )
		return createMdLinks( ( badges as Parameters<typeof createMdLinks>[0] ) )

	return undefined

}

type PkgBadgesOptions = {
	licensePath? : string
	pkgName      : string
	repoName     : string
}

/**
 * Generates markdown links for package-related badges.
 *
 * @param   {PkgBadgesOptions} options - The package badge options.
 * @returns {string}                   The generated markdown links.
 */
export const pkgBadges = ( {
	licensePath = '/LICENSE',
	pkgName,
	repoName,
}: PkgBadgesOptions ) => createMdLinks( [
	{
		name   : 'License',
		URL    : licensePath,
		imgURL : createBadgeURL( {
			path      : 'github/license/' + repoName,
			style     : 'for-the-badge',
			color     : 'green',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Version',
		URL    : 'https://www.npmjs.com/package/' + pkgName,
		imgURL : createBadgeURL( {
			path  : 'npm/v/' + pkgName,
			style : 'for-the-badge',
			color : 'blue',
			label : 'Version',
		} ),
	},
] )
