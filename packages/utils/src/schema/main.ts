import { Validator } from '@cfworker/json-schema'
import { compile }   from 'json-schema-to-typescript'

import {
	catchError,
	TypedError,
} from '../error/main'
import { getObjectFrom } from '../object/main'
import {
	validate as jsValidate,
	ValidateError,
}   from '../validate/main'

import type {
	Schema2tsProps,
	Schema2typeProps,
} from './types'
import type { ValidateAnyType } from '../validate/main'

/**
 * JSON schema to typescript type string
 *
 * Useful, for example, to display a schema in a readable way for the user.
 * @param {Schema2tsProps} params - Options.
 * @returns {Promise<string>}
 * ---
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
	compile( params.schema, params.name, {
		bannerComment : '',
		...params?.opts,
	} )

/**
 * Converts a JSON schema to a TypeScript type string.
 * @param {Schema2typeProps} params - Options for conversion.
 * @param {object} params.schema - The JSON schema to convert.
 * @param {boolean} [params.required] - If true, removes optional marking from fields.
 * @param {boolean} [params.noUnknownObject] - If true, removes unknown object indexing from the result.
 * @returns {Promise<string>} - The TypeScript type string representation of the schema.
 * ---
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
		throw new ValidateSchemaError( ERROR_ID.INVALID_DATA, { data: error.errors }  )

	throw new ValidateSchemaError( ERROR_ID.UNEXPECTED, { data: error.message }  )

}

/**
 * Validate a data from a schema.
 *
 * This function accepts both `data` and `schema` as required parameters, which can either be
 * an object or a string. If a string is provided, it may represent a file path or a URL, and
 * the format can be one of the following: JSON, YAML, TOML, JS, INI, CSV, or XML.
 * @param {string | object} data - The data to be validated. It can be a string representing a file path or URL,
 *                                  or an object containing the data to validate.
 * @param {string | object} schema - The schema against which the data will be validated. It can be a string
 *                                   representing a file path or URL, or an object representing the schema.
 * @returns {Promise<object>} - The validated JSON data.
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

		if ( !validated.valid ) throw new ValidateSchemaError( ERROR_ID.INVALID_DATA, { data: validated.errors }  )
		return data

	}
	catch ( error ) {

		// @ts-ignore
		throw new ValidateSchemaError( error?.message || ERROR_ID.UNEXPECTED )

	}

}
