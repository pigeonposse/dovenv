import { CONTRIBUTOR_ROLE } from './const'
import { Contributors }     from './core'

const contributors = new Contributors( { opts : {
	role : {
		...CONTRIBUTOR_ROLE,
		2 : {
			name  : 'custom role',
			emoji : '👥',
		},
	},
	member : [
		{
			role       : 'author',
			ghUsername : 'angelespejo',
			name       : 'Ángel espejo',
			avatar     : 'https://github.com/angelespejo.png?s=75',
		},
		{
			role       : 'organization',
			ghUsername : 'pigeonposse',
			name       : 'Pigeon Posse',
			avatar     : 'https://github.com/pigeonposse.png?s=75',
		},
	],
} } )

console.log( await contributors.getHtmlContent() )
console.log( await contributors.getMarkdownContent() )
console.log( await contributors.getTerminalContent( { content: { image: false } } ) )
