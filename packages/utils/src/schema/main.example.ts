
import {
	validateSchema,
	schema2ts,
	schema2type,
	schema2zod,
} from './main'
import pkg            from '../../package.json'
import { catchError } from '../error/main'
import { highlight }  from '../styles/main'
import {
	resolvePath,
	getCurrentDir,
} from '../sys/main'
import { validate as jsValidate } from '../validate/main'

const pkgRoute = resolvePath( getCurrentDir( import.meta.url ), '../../package.json' )
const data     = {
	obj : {
		schema : {
			type       : 'object',
			properties : {
				name : { type: 'string' },
				age  : {
					type    : 'integer',
					minimum : 0,
				},
				city : { type: 'string' },
			},
			required             : [ 'name', 'age' ],
			additionalProperties : false,
		},
		data : {
			name : 'Alice',
			age  : 30,
			city : 'New York',
		},
		invalidData : {
			name : 'Bob',
			age  : -5, // Edad no válida
			city : 'Los Angeles',
		},
	},
	url : {
		schema      : 'https://json.schemastore.org/package.json',
		data        : pkg,
		invalidData : { name: 2 },
	},
	local : {
		schema      : 'https://json.schemastore.org/package.json',
		data        : pkgRoute,
		invalidData : { name: 2 },
	},
	js : {
		schema      : jsValidate.object( { type: jsValidate.string() } ),
		data        : { type: 'string' },
		invalidData : { type: 2 },
	},
	openapi : {
		schema : 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/refs/heads/main/schemas/v3.0/schema.yaml',
		data   : {
			'openapi' : '3.0.0',
			'info'    : {
				title       : 'API Title',
				version     : '1.0.0',
				description : 'API Description',
			},
			'paths' : { '/example' : { get : {
				summary   : 'Example endpoint',
				responses : { 200: { description: 'Success response' } },
			} } },
			'x-tagGroups' : [
				{
					'name'   : 'group1',
					'x-tags' : [ 'tag1', 'tag2' ],
				},
			],
		},
		invalidData : { 'x-tagGroups' : [
			{
				'name'   : 'group1',
				'x-tags' : [ 'tag1', 'tag2' ],
			},
			{
				'name'   : 'group2',
				'x-tags' : [ 'tag1', 'tag2' ],
			},
		] },
	},
}
const content  = await schema2ts( {
	name   : 'MySchemaInterface',
	schema : data.obj.schema,
} )
console.log( 'Schema Definition:' )

console.log( content )
console.log( '\ncolored:\n\n' )
console.log( highlight( content,  { language: 'ts' } ) )
console.log( '\ntype:\n\n' )
console.log( await schema2type( { schema: data.obj.schema } ) )
console.log( '\nZOD:\n\n' )
console.log( await schema2zod( { schema: data.obj.schema } ) )

console.log()
console.log( 'Validation:' )
for ( const [ k, v ] of Object.entries( data ) ) {

	const [ _, data ] = await catchError( validateSchema( v.data, v.schema ) )
	const [ error ]   = await catchError( validateSchema( v.invalidData, v.schema ) )
	// @ts-ignore
	const getError = ( e: unknown ) => JSON.stringify( e?.data?.data, undefined, 2 ) || e?.message
	console.log( { [k] : {
		data  : data || getError( _ ),
		error : getError( error ),
	} } )

}

