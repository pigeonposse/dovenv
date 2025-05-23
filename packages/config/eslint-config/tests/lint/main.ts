import * as eslint from 'eslint'

const toConsole  =  'holaaaa'
const toConsole2 =   ( _d: string ) => {}
const toConsole3 = ( ) => {}
type DirectiveConfigSchema = | 'allow-with-description' |
	{ descriptionFormat?: string }
	| boolean
interface T2 {
	func  : ( arg: boolean ) => void
	hola  : ( ) => void
	otro? : ( ) => void

}

interface T3 {
	func  : ( ( arg: number ) => void ) & ( ( arg: string ) => void ) & ( ( arg: boolean ) => void )
	hola  : ( ) => void
	otro? : ( ) => void
}

const f: DirectiveConfigSchema & T3 & T2 = {} as DirectiveConfigSchema & T3 & T2
console.log( f )

/**
 * Plugin-promiseplugin-promiseplugin-promise.
 *
 * @see https://github.com/eslint-community/eslint-plugin-promisehttps://github.com/eslint-community/eslint-plugin-promise
 * @see https://github.com/eslint-community/eslint-plugin-promiseplugin-promiseplugin-promiseplugin-promise
 */
async function logf() {

	const b         = 'https://github.com/eslint-community/eslint-plugin-promiseplugin-promiseplugin-promise'
	const OBJECT_1  = {
		EMPTY : {},
		ONE   : { V: 1 },
		two   : {
			V : 1,
			r : 2,
		},
		G      : '',
		array1 : [],
		array2 : [ 1, 2 ],
		array  : [
			1,
			2,
			3,
			4,
		],
	}
	const newObject = {
		a : 1,
		c : 1,
		b : [
			2,
			{
				a : 3,
				b : 4,
			},
		],
	}

	const f = await fetch( 'https://jsonplaceholder.typicode.com/todos/1' )

	// @ts-ignore: ff
	for await ( const chunk of f.body ) {

		console.log( chunk, newObject )

	}
	if ( toConsole
		&& b
		&& eslint
		&& ( OBJECT_1
			|| newObject
			|| f
		)
	) {

		console.log( {
			b,
			toConsole,
			toConsole2,
			toConsole3,
			eslint,
			f,
			newObject,
			OBJECT_1,
		} )

	}

}

declare const array: string[]

for ( const i in array ) {

	console.log( array[i] )

}

try {

	logf()

}
catch ( _e ) {

	const {
		foo, ...rest
	} = {
		foo : 'bar',
		bar : 'foo',
	}

	console.log( rest )
	// console.error( _e )

}

