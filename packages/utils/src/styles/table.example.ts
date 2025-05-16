import { color }     from './color'
import {
	box,
	Table,
	// table,
}   from './table'
import { icon }         from './text'
import { terminalSize } from '../main'

const { columns } = terminalSize( )
const lineChar    = icon.line

const tableData = {
	head : [
		'',
		'Name',
		'GitHub',
	],
	body : [
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
	],
}

const tableContent = ( new Table( {
	head               : tableData.head,
	wrapOnWordBoundary : true,
	wordWrap           : true,
} ) )

tableData.body.forEach( row => tableContent.push( row ) )

console.log( box( tableContent.toString(), {
	title       : color.inverse( ' Table in a box ' ),
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
} ).trimEnd() )

console.log( tableContent.toString() )

// console.log( table( [ tableData.head, ...tableData.body ], {
// 	drawVerticalLine   : () => true,
// 	drawHorizontalLine : () => true,
// 	columnDefault      : {
// 		wrapWord : true,
// 		width    : 40,
// 	},
// } ) )
