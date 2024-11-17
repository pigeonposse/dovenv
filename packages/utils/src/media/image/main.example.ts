import { image } from './main'

console.log( await image( { input: 'https://avatars.githubusercontent.com/u/111685953' } ) )

console.log( await image( {
	input        : 'https://avatars.githubusercontent.com/u/111685953',
	width        : '100%',
	height       : '100%',
	asciiOutput  : true,
	asciiOptions : {
		color : true,
		chars : ' #*',
	},
} ) )

console.log( await image(  {
	input        : 'https://avatars.githubusercontent.com/u/111685953',
	width        : '70%',
	height       : '70%',
	asciiOutput  : true,
	asciiOptions : { color: false },
} ) )

