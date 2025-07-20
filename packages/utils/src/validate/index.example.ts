
import {
	validate,
	createValidateSchema,
	createValidateSchemaFn,
	formatValidationError,
	serializeValidation,
	deserializeValidation,
	Validation,
	ToObjectValidate,
} from './index'

// Example 1: Define a schema using createValidateSchema
type User = {
	name : string
	age  : number
}

// Use the wrapper to create a schema
const userSchema: ToObjectValidate<User> = createValidateSchema<User>( v =>
	v.object( {
		name : v.string().min( 2 ),
		age  : v.number().int().positive(),
	} ),
)

// Example data to validate
const input  = {
	name : 'Alice',
	age  : 25,
}
const result = userSchema.parse( input )
console.log( '✅ Valid user:', result )
try {

	// must be error
	userSchema.parse( {
		name : 'Bob',
		age  : -1,
	} )

}
catch ( error ) {

	console.log( '❌ userSchema intencial error:', formatValidationError( error ) )

}

// Example 2: Use createValidateSchemaFn to define reusable schema generators
const userSchemaFn = createValidateSchemaFn<User>( v =>
	v.object( {
		name : v.string().min( 2 ),
		age  : v.number().int().positive(),
	} ),
)

const anotherUserSchema = userSchemaFn( validate )
try {

	anotherUserSchema.parse( {
		name : 'Bob',
		age  : -1,
	} )

}
catch ( error ) {

	console.log( '❌ anotherUserSchema intencial error:', formatValidationError( error ) )

}

// Example 3: Using the Validation utility class
const validation = new Validation()

const roleSchema = validation.createLiteralUnion( [
	'admin',
	'editor',
	'viewer',
] )

console.log( '🔎 roleSchema Literal union valid:', roleSchema.parse( 'admin' ) )

try {

	roleSchema.parse( 'guest' ) // This will throw

}
catch ( error ) {

	console.log( '🚫 roleSchema Invalid role:', validation.formatError( error ) )

}

const serialized = serializeValidation( userSchema )

console.log( '🧵 Serialized schema:', serialized )

const deserialized = await deserializeValidation( serialized )
console.log( '🔁 Deserialized schema parsed:' )
const result2 = deserialized.parse( input )
console.log( result2 )

