import {
	deepmergeCustom,
	existsPath,
	joinPath,
	joinUrl,
} from '@dovenv/utils'
import chroma  from 'chroma-js'
import Vibrant from 'node-vibrant'

import { defaultConf } from './default'

import type { DocsConfig } from './types'

const setRepoUrl = async ( dir: string, path: string, userConfig: DocsConfig ) => {

	const licensePath  = joinPath( dir, path )
	const existLicense = await existsPath( licensePath )
	if ( existLicense && userConfig.repoUrl ) return joinUrl( userConfig.repoUrl, 'blob/main', path )

	return undefined

}

export const mergeConfig = async ( userConfig: DocsConfig, pkgConfig: Record<string, unknown> | undefined, dir: string ) => {

	// if ( !pkgConfig ) return { userConfig

	const docsPath  = userConfig.in ? joinPath( dir, userConfig.in ) : joinPath( dir, defaultConf.in )
	const existDocs = await existsPath( docsPath )
	if ( !existDocs ) {

		console.error( `Docs path not found in ${docsPath}` )
		process.exit( 1 )

	}
	const docsPublic = joinPath( docsPath, 'public' )
	const logo       = userConfig.logo ? joinPath( docsPublic, userConfig.logo ) : joinPath( docsPublic, defaultConf.logo )
	const existLogo  = await existsPath( logo )

	// @ts-ignore: because maybe is not exist
	if ( !userConfig.styles ) userConfig.styles = {}
	// @ts-ignore: because maybe is not exist
	if ( !userConfig.styles.color ) userConfig.styles.color = {}

	if ( ( existLogo && !userConfig.styles.color.primary ) || userConfig.styles.color.primary ) {

		type Colors = DocsConfig['styles']['color']
		let colors: Omit<Colors, 'dark' | 'light'>
		// console.log ( existLogo && !userConfig.styles.color.primary, userConfig.styles.color.primary )
		if ( existLogo && !userConfig.styles.color.primary ) {

			const palette = await Vibrant.from( logo ).getPalette()

			colors = {
				primary   : palette?.Vibrant?.hex as string,
				secondary : palette?.LightVibrant?.hex as string,
				terciary  : palette?.DarkVibrant?.hex as string,
				fourth    : palette?.Muted?.hex as string,
			}

		}
		else if ( userConfig.styles.color.primary ) {

			const baseColor = userConfig.styles.color.primary

			colors = {
				primary   : chroma( baseColor ).hex(),
				secondary : chroma( baseColor ).darken( 2 ).hex(),
				terciary  : chroma( baseColor ).brighten( 2 ).hex(),
				fourth    : chroma( baseColor ).saturate( -2 ).hex(),
			}

		}
		else colors = defaultConf.styles.color

		const themeColors:Colors = {
			...colors,
			dark : {
				text      : chroma( colors.primary ).brighten( 4 ).hex(),
				text2     : chroma( colors.primary ).brighten( 4 ).alpha( 0.8 ).hex(),
				text3     : chroma( colors.secondary ).brighten( 2 ).alpha( 0.8 ).hex(),
				bg        : chroma( colors.primary ).darken( 8 ).hex(),
				bgAlt     : chroma( colors.primary ).darken( 6 ).alpha( 0.8 ).hex(),
				bgSoft    : chroma( colors.secondary ).darken( 6 ).hex(),
				bgOpacity : chroma( colors.terciary ).darken( 6 ).alpha( 0.5 ).hex(),
				shadow    : chroma( colors.secondary ).brighten( 4 ).alpha( 0.05 ).hex(),
				divider   : chroma( colors.secondary ).brighten( 4 ).alpha( 0.1 ).hex(),
			},
			light : {
				text      : chroma( colors.primary ).darken( 4 ).hex(),
				text2     : chroma( colors.primary ).darken( 4 ).alpha( 0.8 ).hex(),
				text3     : chroma( colors.secondary ).darken( 2 ).alpha( 0.8 ).hex(),
				bg        : chroma( colors.primary ).brighten( 8 ).hex(),
				bgAlt     : chroma( colors.primary ).brighten( 6 ).alpha( 0.8 ).hex(),
				bgSoft    : chroma( colors.secondary ).brighten( 6 ).hex(),
				bgOpacity : chroma( colors.terciary ).brighten( 6 ).alpha( 0.5 ).hex(),
				shadow    : chroma( colors.secondary ).darken( 4 ).alpha( 0.05 ).hex(),
				divider   : chroma( colors.secondary ).darken( 4 ).alpha( 0.1 ).hex(),
			},
		}

		userConfig.styles.color = deepmergeCustom<Colors>( {} )( themeColors, userConfig.styles.color )

	}

	// base values
	if ( pkgConfig ) {

		// @ts-ignore: because maybe is not exist
		if ( !userConfig.fundingUrl && typeof pkgConfig?.funding?.url === 'string' ) userConfig.fundingUrl = pkgConfig.funding.url
		// @ts-ignore: because maybe is not exist
		if ( !userConfig.repoUrl && typeof pkgConfig?.repository?.url === 'string' ) userConfig.repoUrl = pkgConfig.repository.url
		// @ts-ignore: because maybe is not exist
		if ( !userConfig.bugsUrl && typeof pkgConfig?.bugs?.url === 'string' ) userConfig.bugsUrl = pkgConfig.bugs.url
		// @ts-ignore: because maybe is not exist
		if ( !userConfig.url && typeof pkgConfig?.homepage === 'string' ) userConfig.url = pkgConfig.homepage
		if ( !userConfig.desc && typeof pkgConfig?.description === 'string' ) userConfig.desc = pkgConfig.description
		// @ts-ignore: because maybe is not exist
		if ( !userConfig.name && typeof pkgConfig?.name === 'string' ) userConfig.name = pkgConfig.name
		// @ts-ignore: because maybe is not exist
		if ( !userConfig.version && typeof pkgConfig?.version === 'string' ) userConfig.version = pkgConfig.version

		// @ts-ignore: because maybe is not exist
		if ( ( !userConfig.license || !userConfig.license.type ) && typeof pkgConfig?.license?.type === 'string' ) {

			// @ts-ignore: because maybe is not exist
			if ( !userConfig.license ) userConfig.license = {}
			// @ts-ignore: because maybe is not exist
			userConfig.license.type = pkgConfig.license

			userConfig.license.url = await setRepoUrl( dir, 'LICENSE', userConfig ) || userConfig.license.url

		}
		if ( !userConfig.changelogUrl ) userConfig.changelogUrl = await setRepoUrl( dir, 'CHANGELOG.md', userConfig ) || userConfig.changelogUrl
		if ( !userConfig.contributingUrl ) userConfig.contributingUrl = await setRepoUrl( dir, 'CONTRIBUTING.md', userConfig ) || userConfig.contributingUrl
		if ( !userConfig.contributors || !userConfig.contributors.length ) {

			const setCont = ( contributor: Record<string, unknown>, type: string ) => {

				if (
					!contributor
					|| !( 'name' in contributor
						&& 'url' in contributor
						&& typeof contributor.name === 'string'
						&& typeof contributor.url === 'string'
					)
				) return []
				const isGithub = contributor.url.startsWith( 'https://github.com/' )
				return [
					{
						name   : contributor.name,
						title  : type,
						avatar : isGithub ? contributor.url + '.png' : '',
						links  : [
							( isGithub
								? {
									icon : 'github',
									link : contributor.url,
								}
								: {}
							),
						],
					},
				]

			}

			// @ts-ignore: because maybe is not exist
			userConfig.contributors = [ ...setCont( pkgConfig?.author, 'Author' ) ]
			if ( pkgConfig.contributors && Array.isArray( pkgConfig.contributors ) )
				// @ts-ignore: because maybe is not exist
				pkgConfig.contributors.forEach( contributor => userConfig.contributors.push( ...setCont( contributor, 'Contributor' ) ) )

		}

	}

	// child values

	return {
		default : defaultConf,
		pkg     : pkgConfig,
		config  : deepmergeCustom<DocsConfig>( {} )( defaultConf, userConfig ) as DocsConfig,
		user    : userConfig,
	}

}
