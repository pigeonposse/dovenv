import { color } from './color'
import { line }  from './line'
import { icon }  from './text'

console.log( )
console.log( )
console.log( line( {
	title : ' Hello World ',
	align : 'left',
} ) )
console.log( )
console.log( )
console.log( line( {
	title    : color.green( ' Hello World ' ),
	lineChar : color.green( '⎯' ),
	align    : 'right',
} ) )
console.log( )
console.log( )
console.log( line( {
	title    : ' ' + color.bgCyan( ' Hello World ' ) + ' ',
	lineChar : color.cyan( '⎯' ),
} ) )
console.log( )
console.log( )
console.log(  line( {
	title    : ' ' + color.bgRed( ' Hello World ' ) + ' ',
	lineChar : color.red( '⎯' + icon.cross + icon.ellipsis ),
} )  )
