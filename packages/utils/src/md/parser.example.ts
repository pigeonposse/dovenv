import {
	createBadgeURL,
	createMdLinks,
	markdown,
} from '.'

// Define the badges
const badges = [
	{
		name   : 'Web',
		URL    : 'https://pigeonposse.com',
		imgURL : createBadgeURL( {
			path      : 'badge/Web-grey',
			style     : 'for-the-badge',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'About Us',
		URL    : 'https://pigeonposse.com?popup=about',
		imgURL : createBadgeURL( {
			path      : 'badge/About%20Us-grey',
			style     : 'for-the-badge',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Donate',
		URL    : 'https://pigeonposse.com/?popup=donate',
		imgURL : createBadgeURL( {
			path      : 'badge/Donate-pink',
			style     : 'for-the-badge',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Github',
		URL    : 'https://github.com/pigeonposse',
		imgURL : createBadgeURL( {
			path      : 'badge/Github-black',
			style     : 'for-the-badge',
			logo      : 'github',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Twitter',
		URL    : 'https://twitter.com/pigeonposse_',
		imgURL : createBadgeURL( {
			path      : 'badge/Twitter-black',
			style     : 'for-the-badge',
			logo      : 'twitter',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Instagram',
		URL    : 'https://www.instagram.com/pigeon.posse/',
		imgURL : createBadgeURL( {
			path      : 'badge/Instagram-black',
			style     : 'for-the-badge',
			logo      : 'instagram',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Medium',
		URL    : 'https://medium.com/@pigeonposse',
		imgURL : createBadgeURL( {
			path      : 'badge/Medium-black',
			style     : 'for-the-badge',
			logo      : 'medium',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'License',
		URL    : '/LICENSE',
		imgURL : createBadgeURL( {
			path      : 'github/license/pigeonposse/dovenv',
			style     : 'for-the-badge',
			color     : 'green',
			logoColor : 'white',
		} ),
	},
	{
		name   : 'Version',
		URL    : 'https://www.npmjs.com/package/dovenv',
		imgURL : createBadgeURL( {
			path  : 'npm/v/dovenv',
			style : 'for-the-badge',
			color : 'blue',
			label : 'Version',
		} ),
	},
]

// Generate Markdown for badges
const badgeMarkdown = createMdLinks( badges )

const obj = await markdown.deserialize( `# Dovenv - Utilities

${badgeMarkdown}

## 📖 Description

Toolkit to make your code workspace robust, easier and cleaner.	
` )
const str = await markdown.serialize( obj )
console.log( obj, str )
