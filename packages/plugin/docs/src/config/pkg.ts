import { getPackageRepoUrlFromContent } from '@dovenv/core/utils'

import type { DocsConfig }  from './types'
import type { PackageJSON } from '../_shared/types'

/**
 * Extracts and constructs documentation configuration from package JSON data.
 *
 * @param   {PackageJSON}         pkgData - The package JSON data object.
 * @returns {Promise<DocsConfig>}         A promise that resolves to a `DocsConfig` object containing extracted configuration details like funding URL, bugs URL, license, homepage URL, description, name, version, and contributors.
 */
export const getPkgConfig = async ( pkgData: PackageJSON ): Promise<DocsConfig> => {

	const config: DocsConfig = {}

	config.footer  = {
		copy  : undefined,
		links : undefined,
	}
	config.license = {
		type : undefined,
		url  : undefined,
	}

	if ( typeof pkgData?.funding === 'object' ) {

		if ( Array.isArray( pkgData.funding ) ) {

			if ( typeof pkgData?.funding?.[0] === 'object' && typeof pkgData.funding[0].url === 'string' )
				config.fundingURL = pkgData.funding[0].url

		}
		else if ( typeof pkgData?.funding?.url === 'string' ) config.fundingURL = pkgData.funding.url

	}

	if ( pkgData?.repository ) config.repoURL = getPackageRepoUrlFromContent( pkgData )

	if ( typeof pkgData?.bugs === 'object' && typeof pkgData?.bugs?.url === 'string' )
		config.bugsURL = pkgData.bugs.url

	if ( pkgData?.license ) config.license.type = pkgData.license
	if ( typeof pkgData?.homepage === 'string' ) config.url = pkgData.homepage
	if ( typeof pkgData?.description === 'string' ) config.desc = pkgData.description

	// name
	if ( typeof pkgData?.extra?.productName === 'string' ) config.name = pkgData.extra.productName
	else if ( typeof pkgData?.extra?.id === 'string' ) config.name = pkgData.extra.id
	else if ( typeof pkgData?.name === 'string' ) config.name = pkgData.name

	if ( typeof pkgData?.version === 'string' ) config.version = pkgData.version

	type ContributorPkg = NonNullable<PackageJSON['contributors']>[number] | PackageJSON['author']
	type Contributor = NonNullable<DocsConfig['contributors']>
	const setCont = ( contributor: ContributorPkg, type: string ): Contributor => {

		if (
			!contributor
			|| !( typeof contributor === 'object' && 'name' in contributor
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
				links  : ( isGithub
					? [
						{
							icon : 'github',
							link : contributor.url,
						},
					]
					: []
				),
			},
		]

	}

	config.contributors = [ ...setCont( pkgData?.author, 'Author' ) ]
	if ( pkgData.contributors && Array.isArray( pkgData.contributors ) ) {

		for ( let index = 0; index < pkgData.contributors.length; index++ ) {

			const contributor = pkgData.contributors[index]
			config.contributors.push( ...setCont( contributor, 'Contributor' ) )

		}

	}

	if ( !pkgData.extra ) return config

	const changlog        = pkgData.extra.changelogURL || pkgData.extra.changelogUrl
	const license         = pkgData.extra.licenseURL || pkgData.extra.licenseUrl
	const library         = pkgData.extra.libraryURL || pkgData.extra.libraryUrl
	const moreURL         = pkgData.extra.collective?.url
	const footerLinks     = {
		web   : pkgData.extra.collective.web,
		email : pkgData.extra.collective.email,
		...pkgData.extra.collective.social,
	}
	const shortDesc       = pkgData.extra.shortDesc
	const contributingURL = pkgData.extra.contributingURL || pkgData.extra.contributingUrl

	config.footer.copy = {
		name : pkgData.extra.collective?.name || pkgData.extra.collective?.id,
		url  : pkgData.extra.collective?.url,
	}

	if ( changlog ) config.changelogURL = changlog
	if ( license ) config.license.url = license
	if ( library ) config.npmURL = library
	if ( moreURL ) config.moreURL = moreURL
	if ( shortDesc ) config.shortDesc = shortDesc
	if ( footerLinks ) config.footer.links = footerLinks
	if ( contributingURL ) config.contributingURL = contributingURL

	return config

}
