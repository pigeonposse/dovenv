import number from './number'

const p = await number( {
	message   : 'What is your age?',
	errorText : 'failed',
} )

console.log( p )

