import { cache } from './cache'

const {
	get, set, defaultValues,
} = await cache( {
	projectName : 'dovenv',
	id          : 'example-setting',
	values      : {
		boolean : true,
		number  : 10,
		string  : 'en',
		array   : [
			1,
			2,
			3,
		],
		arrayMulti : [
			'string',
			2,
			3,
		],
	},
} )

const res = {
	boolean    : get( 'boolean' ),
	number     : get( 'number' ),
	string     : get( 'string' ),
	array      : get( 'array' ),
	arrayMulti : get( 'arrayMulti' ),
}

set( {
	boolean : false,
	number  : 10,
	string  : 'es',
	array   : [
		0,
		1,
		2,
		3,
	],
} )

const updatedRes = get()

console.log( {
	initRes : res,
	updatedRes,
	defaultValues,
} )
