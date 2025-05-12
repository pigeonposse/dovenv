import { color }        from './color'
import { box }          from './table'
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

console.log( content )
