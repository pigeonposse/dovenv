import { color } from './color'
import { line }  from './line'
import { icon }  from './text'

type LineProps = Parameters<typeof line>[0]

const define  = ( props: LineProps ) => {

	console.log( '\n' )
	console.log( line( {
		title      : color.inverse( ' Value ' ),
		lineChar   : icon.dot,
		lineColor  : b => color.gray( b ),
		titleAlign : 'right',
	} ) + '\n' )
	console.log( )
	console.log( line( props ) )
	console.log( )
	console.log( props )

}
const section = ( t:string ) => {

	console.log( )
	console.log( )
	console.log( line( { title: `  ${t} ` } ) )
	console.log( )
	console.log( )

}

////////////////////////////////////////////////////////////////////////////////////////
section( 'ONE LINE' )

const values = [
	'center',
	'left',
	'right',
] as const
for ( const v of values ) {

	define( {
		title      : color.green( 'Hello World' ),
		lineChar   : icon.line,
		lineColor  : b => color.green( b ),
		titleAlign : v,
	} )

}

////////////////////////////////////////////////////////////////////////////////////////
section( 'ONE LINE + different width' )
const values2 = [
	[
		'center',
		'center',
		50,
	],
	[
		'left',
		'center',
		50,
	],
	[
		'right',
		'center',
		50,
	],
	[
		'right',
		'left',
		50,
	],
	[
		'left',
		'right',
		40,
	],
	[
		'right',
		'right',
		100,
	],
	[
		'right',
		'right',
		60,
	],
] as const
for ( const v of values2 ) {

	define( {
		title      : color.inverse( ' Hello World ' ),
		lineChar   : icon.cross,
		lineColor  : b => color.blue( b ),
		titleAlign : v[0],
		align      : v[1],
		width      : v[2],
	} )

}

////////////////////////////////////////////////////////////////////////////////////////
section( 'two LINE + different width' )

const values3 = [
	[
		'top-center',
		'center',
		70,
	],
	[
		'top-right',
		'right',
		70,
	],
	[
		'top-left',
		'right',
		70,
	],
	[
		'bottom-center',
		'center',
		50,
	],
	[
		'bottom-right',
		'right',
		100,
	],
	[
		'bottom-left',
		'right',
		100,
	],

] as const
for ( const v of values3 ) {

	// define( {
	// 	title      : ' Hello World ',
	// 	lineChar   : '',
	// 	lineColor  : 'green',
	// 	titleAlign : v[0],
	// 	align      : v[1],
	// 	width      : v[2],
	// } )
	// define( {
	// 	lineChar   : icon.triangleDown,
	// 	lineColor  : 'green',
	// 	titleAlign : v[0],
	// 	align      : v[1],
	// 	width      : v[2],
	// } )
	define( {
		title      : 'Hello World',
		lineChar   : icon.triangleDown,
		titleAlign : v[0],
		align      : v[1],
		width      : v[2],
	} )
	define( {
		title      : color.red.inverse( ' Hello World ' ).trim(),
		lineChar   : icon.triangleDown,
		lineColor  : b => color.red( b ),
		titleAlign : v[0],
		align      : v[1],
		width      : v[2],
	} )

}

