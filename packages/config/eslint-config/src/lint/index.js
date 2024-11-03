import * as eslint from 'eslint'

const toConsole  =  'holaaaa'
const toConsole2 =   _d => {}
const toConsole3 = ( ) => {}

/**
 * plugin-promiseplugin-promiseplugin-promise
 * plugin-promiseplugin-promiseplugin-promiseplugin-promise
 * @see https://github.com/eslint-community/eslint-plugin-promisehttps://github.com/eslint-community/eslint-plugin-promise
 * @see github.com/eslint-community/eslint-plugin-promiseplugin-promiseplugin-promiseplugin-promise
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

	for await ( const chunk of f.body ) {

		console.log( chunk, newObject )

	}

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

try {

	logf( a => ( a ) )

}

catch ( _e ) {

	const {
		foo,
		...rest
	} = {
		foo : 'bar',
		bar : 'foo',
	}

	console.log( rest )
	// console.error( _e )

}

