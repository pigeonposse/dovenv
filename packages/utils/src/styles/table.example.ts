import { color } from './color'
import {
	box,
	table,
}   from './table'
import { icon }         from './text'
import { terminalSize } from '../main'

const { columns } = terminalSize( )
const lineChar    = icon.line

const content = box( '', {
	title       : color.inverse( ' Title ' ),
	borderStyle : {
		top         : lineChar,
		topLeft     : lineChar,
		topRight    : lineChar,
		left        : '',
		right       : '',
		bottomRight : '',
		bottomLeft  : '',
		bottom      : '',
	},
	borderColor    : 'blue',
	titleAlignment : 'center',
	float          : 'center',
	padding        : 0,
	margin         : 0,
	width          : columns,
	// fullscreen     : width => [ width, 0 ],
} ).trimEnd()

// console.log( { content } )
console.log( table( [
	[
		'',
		'Name',
		'GitHub',
	],
	[
		'\u001B[90m<img src="https://github.com/AngelEspejo.png?size=72" />\u001B[39m',
		'Ángel Espejo',
		'\u001B[34m\u001B]8;;https://github.com/AngelEspejo\x07\u001B[34m\u001B[4m@AngelEspejo\u001B[24m\u001B[39m\u001B[34m\u001B]8;;\x07\u001B[39m',
	],
	[
		'\u001B[90m<img src="https://github.com/AlejoMalia.png?size=72"/>\u001B[39m',
		'Alejo Malia',
		'\u001B[34m\u001B]8;;https://github.com/AlejoMalia\x07\u001B[34m\u001B[4m@AlejoMalia\u001B[24m\u001B[39m\u001B[34m\u001B]8;;\x07\u001B[39m',
	],
	[
		'\u001B[90m<img src="https://github.com/irfaelo.png?size=72" />\u001B[39m',
		'Ignacio Ramos',
		'\u001B[34m\u001B]8;;https://github.com/irfaelo\x07\u001B[34m\u001B[4m@irfaelo\u001B[24m\u001B[39m\u001B[34m\u001B]8;;\x07\u001B[39m',
	],
], {
	drawVerticalLine   : () => true,
	drawHorizontalLine : () => true,
	columnDefault      : { wrapWord: true },

} ) )
console.log( content )
