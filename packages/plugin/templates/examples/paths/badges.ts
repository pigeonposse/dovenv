import {
	createBadgeURL,
	createMdLinks,
} from '@dovenv/core/utils'

type SocialLinks = {
	web?       : string
	about?     : string
	donate?    : string
	github?    : string
	twitter?   : string
	instagram? : string
	medium?    : string
}
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
		.filter( badge => badge.URL )
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
		return createMdLinks( badges as Parameters<typeof createMdLinks>[0] )
	return undefined

}
export const pkgBadges = ( {
	licensePath = '/LICENSE',
	pkgName,
	repoName,
}:{
	licensePath? : string
	pkgName      : string
	repoName     : string
} ) => createMdLinks( [
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
