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
}:NavProps ) => {

	return [
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
		...( conf.version
			? [
				{
					text  : conf.version,
					items : [
						...( conf.changelogUrl
							? [
								{
									text : 'Changelog',
									link : conf.changelogUrl,
								},
							]
							: []
						),
						...( conf.contributingUrl
							? [
								{
									text : 'Contributing',
									link : conf.contributingUrl,
								},
							]
							: []
						),
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
							: []
						),
					],
				},
			]
			: []
		),
	]

}
