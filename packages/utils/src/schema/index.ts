import { Validator }       from '@cfworker/json-schema' // 174KB. @see https://pkg-size.dev/@cfworker/json-schema@4.1.1
import { compile }         from 'json-schema-to-typescript-lite' // 1.4MB. @see https://pkg-size.dev/json-schema-to-typescript-lite@14.1.0
import { jsonSchemaToZod } from 'json-schema-to-zod' // 109KB @see https://pkg-size.dev/json-schema-to-zod@2.6.1
// import { createGenerator } from 'ts-json-schema-generator' // 28MB @see https://pkg-size.dev/ts-json-schema-generator@2.4.0
import { zodToJsonSchema } from 'zod-to-json-schema' // 212KB (911KB with peers). @see https://pkg-size.dev/zod-to-json-schema@3.24.5

import {
	validate as jsValidate,
	ValidateError,
} from '../validate'

import type {
	Schema2tsProps,
	Schema2typeProps,
	Schema2zod,
	// SchemaObject,
	// Ts2Schema,
	Zod2schema,
} from './types'
import type { ValidateAnyType } from '../validate'

import {
	catchError,
	TypedError,
} from '@/error'
import { getObjectFrom } from '@/object'

/**
 * Converts a zod schema to a JSON schema.
 *
 * @param   {Zod2schema}      params - Options.
 * @returns {Promise<string>}        The JSON schema.
 * @example
 * const jsonSchema = await zod2schema({
 *   schema: z.object({
 *     foo: z.string(),
 *   }),
 *   opts: {
 *     // zodToJsonSchema options
 *   },
 * })
 */
export const zod2schema = async ( params: Zod2schema ) => {

	return await zodToJsonSchema( params.schema, params.opts )

}

/**
 * JSON schema to zod type.
 *
 * @param   {Schema2zod}      params - Options.
 * @returns {Promise<string>}        - Zodtype in string.
 * @example
 * const zodSchema = await schema2zod({
 *   schema: {
 *     type: "object",
 *     ...
 *   }
 * })
 *
 * console.log(zodSchema)
 */
export const schema2zod = async ( params: Schema2zod ) => {

	return await jsonSchemaToZod( params.schema, params.opts )

}

/**
 * Parses a JSON schema string into an object.
 *
 * @template R - The type of the object to be returned.
 * @param   {string} schema - The JSON schema string to parse.
 * @returns {R}             - The parsed object.
 * @throws {SyntaxError} - If the input string is not a valid JSON.
 * @example
 * const obj = schema2object<{ foo: string }>('{"foo": "bar"}');
 * console.log(obj.foo); // Output: "bar"
 */
export const schema2object = <R extends object>( schema: string ): R =>
	JSON.parse( schema )

// /**
//  * Converts a TypeScript type to a JSON schema.
//  *
//  * @param   {Ts2Schema}       params - Options.
//  * @returns {Promise<object>}        The JSON schema.
//  * @example
//  * const jsonSchema = await ts2schema({
//  *   config: {
//  *     path: 'path/to/MyType.ts',
//  *     type: 'MyType',
//  *   },
//  * })
//  *
//  * console.log(jsonSchema)
//  */
// export const ts2schema = async ( params: Ts2Schema ): Promise<SchemaObject> => {

// 	return await createGenerator( params.config ).createSchema( params.config.type )

// }

/**
 * JSON schema to typescript type string.
 *
 * Useful, for example, to display a schema in a readable way for the user.
 *
 * @param   {Schema2tsProps}  params - Options.
 * @returns {Promise<string>}
 *                                   ---.
 * @example
 * const tsString = await schema2ts({
 *   name: 'MySchemaType',
 *   schema: {
 *     type: "object",
 *     ...
 *   }
 * })
 *
 * console.log(tsString)
 */
export const schema2ts = async ( params: Schema2tsProps ) =>
	compile( params.schema, params.name, { ...params?.opts } )

/**
 * Converts a JSON schema to a TypeScript type string.
 *
 * @param   {Schema2typeProps} params                   - Options for conversion.
 * @param   {object}           params.schema            - The JSON schema to convert.
 * @param   {boolean}          [params.required]        - If true, removes optional marking from fields.
 * @param   {boolean}          [params.noUnknownObject] - If true, removes unknown object indexing from the result.
 * @returns {Promise<string>}                           - The TypeScript type string representation of the schema.
 *                                                      ---.
 * @example
 * const typeString = await schema2type({
 *   schema: {
 *     type: "object",
 *     ...
 *   },
 *   required: true,
 *   noUnknownObject: false
 * });
 *
 * console.log(typeString);
 */
export const schema2type = async ( params: Schema2typeProps ) => {

	const name = 'PKGSchema'
	const type = ( await schema2ts( {
		name   : name,
		schema : params.schema,
	} ) )
		.replace( new RegExp( `^[\\s\\S]*?${name}\\s` ), '' ) // Borra lo anterior a "PKGSchema "
	if ( params.required ) type.replaceAll( '?', '' )
	if ( params.noUnknownObject )
		type
			.replaceAll( /^\s*\[k: string\]: unknown;\s*$/gm, '' )
			.replaceAll( /^\s*[\r\n]+/gm, '' )

	return type

}

////////////////////////////////////////////

const ERROR_ID = {
	INVALID_SCHEMA : 'INVALID_SCHEMA',
	INVALID_DATA   : 'INVALID_DATA',
	UNEXPECTED     : 'UNEXPECTED',
} as const

type ErrorID = typeof ERROR_ID[keyof typeof ERROR_ID]
class ValidateSchemaError extends TypedError<ErrorID, { data: unknown }> {}

const validateZod = async ( data: string | object, schema: ValidateAnyType ) => {

	const run               = async () => schema.parse( data )
	const [ error, result ] = await catchError( run() )

	if ( !error ) return result

	if ( error instanceof ValidateError )
		throw new ValidateSchemaError( ERROR_ID.INVALID_DATA, { data: error.errors } )

	throw new ValidateSchemaError( ERROR_ID.UNEXPECTED, { data: error.message } )

}

/**
 * Validate a data from a schema.
 *
 * This function accepts both `data` and `schema` as required parameters, which can either be
 * an object or a string. If a string is provided, it may represent a file path or a URL, and
 * the format can be one of the following: JSON, YAML, TOML, JS, INI, CSV, or XML.
 *
 * @param   {string | object} data   - The data to be validated. It can be a string representing a file path or URL,
 *                                   or an object containing the data to validate.
 * @param   {string | object} schema - The schema against which the data will be validated. It can be a string
 *                                   representing a file path or URL, or an object representing the schema.
 * @returns {Promise<object>}        - The validated JSON data.
 * @throws {ValidateSchemaError} - If the schema is invalid or the data does not conform to the schema.
 * @example import { validateSchema } from '@dovenv/utils'
 *
 * try {
 *   const validData = await validateSchema(
 *     '../../package.json',
 *     'https://json.schemastore.org/package.json'
 *   );
 *   console.log(validData);
 * } catch (error) {
 *     console.error('Validation failed:', error.message);
 * }
 */
export const validateSchema = async ( data: string | object, schema: string | object ): Promise<object> => {

	try {

		if ( typeof data === 'string' ) data = await getObjectFrom( data )

		if ( schema instanceof jsValidate.ZodType ) return await validateZod( data, schema )
		else if ( typeof schema === 'string' ) {

			schema = await getObjectFrom( schema )

			// check again
			if ( typeof schema !== 'object' ) throw new ValidateSchemaError( ERROR_ID.INVALID_SCHEMA, { data: schema } )

		}

		const draft        = '2020-12'
		const shortCircuit = true
		const validator    = new Validator( schema, draft, shortCircuit )
		const validated    = validator.validate( data )

		if ( !validated.valid ) throw new ValidateSchemaError( ERROR_ID.INVALID_DATA, { data: validated.errors } )
		return data

	}
	catch ( error ) {

		// @ts-ignore
		throw new ValidateSchemaError( error?.message || ERROR_ID.UNEXPECTED )

	}

}
