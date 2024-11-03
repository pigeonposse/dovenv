import { replacePlaceholders } from './placeholder'

const content = 'Today is {{day,long}} of {{year}}. Hello {{const.name}} {{const.info.secondName}}. Your friend is {{const.info.more[0].friend}}. You are {{const.info.more[1]}} and {{const.info.more[2]}}. Web: {{ https://example.com }}.'
const text    = await replacePlaceholders( {
	content,
	params : {
		year  : 2024,
		const : {
			name : 'Alice',
			info : {
				secondName : 'Copper',
				more       : [
					{ friend: 'Tony' },
					'rockstar',
					'pimp',
				],
			},
		},
	},
	transform : async v => {

		v = v.startsWith( 'day,' ) && v.split( ',' )[1] === 'long' ? 'Monday' : v
		v = v.startsWith( 'day,' ) && v.split( ',' )[1] === 'short' ? 'Mon' : v
		v = v === 'https://example.com' ? 'https://alice.example.com' : v
		return v

	},
} )
console.log( text )
// Today is Monday of 2024. Hello Alice Copper. Your friend is Tony. You are rockstar and pimp. Web: https://alice.example.com.
