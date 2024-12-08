import { getDownloads } from './get-releases'

import type { DocsConfig } from '../../config/types'

type NavProps = {
	conf   : DocsConfig
	guide? : boolean
	posts? : boolean
	links? : boolean
}
export const setNav = ( {
	conf, guide, posts, links,
}: NavProps ) => {

	const res = [
		// {
		// 	text : 'Home',
		// 	link : '/',
		// },
		...( conf.nav
			? conf.nav
			: [] ),
		...( guide
			? [
				{
					text        : 'Guide',
					activeMatch : '^/guide',
					link        : '/guide',
				},
			]
			: [] ),
		...( posts
			? [
				{
					text        : 'Articles',
					activeMatch : '^/posts',
					link        : '/posts',
				},
			]
			: [] ),
		...( conf.download && conf.download.items
			? [
				{
					text  : 'Downloads',
					items : getDownloads( conf.download ) || [],
				},
			]
			: [] ),
		...( links
			? [
				{
					text        : 'Links',
					activeMatch : '^/links',
					link        : '/links',
				},
			]
			: [] ),
	]

	if ( conf.version ) {

		const versionItems = [
			...( conf?.changelogURL
				? [
					{
						text : 'Changelog',
						link : conf.changelogURL,
					},
				]
				: [] ),
			...( conf.contributingURL
				? [
					{
						text : 'Contributing',
						link : conf.contributingURL,
					},
				]
				: [] ),
			...( conf.oldVersions && conf.oldVersions.length > 0
				? [
					{
						text  : 'Versions',
						items : conf.oldVersions.map( v => ( {
							text : v.name,
							link : v.url,
						} ) ),
					},
				]
				: [] ),
		]

		if ( versionItems.length > 0 ) {

			res.push( {
				text  : conf.version,
				items : versionItems,
			} )

		}
		// else {

		// 	if ( conf.repoURL )res.push( {
		// 		text : conf.version,
		// 		link : conf.repoURL,
		// 	} )

		// }

	}

	return res

}
