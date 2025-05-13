import { cache } from './cache'

const c      = await cache( {
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
const {
	get, set, path,
} = c
const cached = {
	boolean     : await get( 'boolean' ),
	number      : await get( 'number' ),
	string      : await get( 'string' ),
	array       : await get( 'array' ),
	nonExistent : await get( 'nonExistent' ),
	arrayMulti  : await get( 'arrayMulti' ),
}

await set( {
	boolean : false,
	number  : 12,
	string  : 'es',
	array   : [
		0,
		1,
		2,
		3,
	],
} )

await c.reset()

const updated = await get()

console.log( {
	default     : c.defaultValues,
	cached,
	updated,
	path,
	projectName : 'dovenv',
	id          : 'example-setting',
} )
