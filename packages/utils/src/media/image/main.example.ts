import { image } from './main'
import {
	svg,
	svg2terminal,
} from '../svg/main'

console.log( await svg2terminal( {
	input      : 'https://img.shields.io/badge/Web-grey?style=for-the-badge&logoColor=white',
	svgOptions : {
		quality : 100,
		format  : 'jpeg',
		resvg   : { textRendering: 2 },
	},
	// asciiOutput: true,
	width  : '30%',
	height : '30%',
} ) )

console.log( await image( {
	input        : 'https://avatars.githubusercontent.com/u/111685953',
	width        : '100%',
	height       : '100%',
	asciiOutput  : false,
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

