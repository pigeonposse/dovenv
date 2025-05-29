import { box }          from './box'
import { color }        from './color'
import { icon }         from './text'
import { terminalSize } from '../process'

const { columns } = terminalSize( )
const lineChar    = icon.line
console.log( box( 'Fancy table\nLonger text', { padding: 1 } ) )
console.log( box( 'Box content', {
	headerText  : color.blue.inverse( ' Table in a box ' ),
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
	borderColor     : border => color.blue( border ),
	headerAlignment : 'center',
	float           : 'center',
	padding         : 0,
	margin          : 0,
	width           : columns,
	// fullscreen     : width => [ width, 0 ],
} ).trimEnd() )

