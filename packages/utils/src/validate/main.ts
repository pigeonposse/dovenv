import {
	z,
	ZodError,
} from 'zod'
import { fromError } from 'zod-validation-error'
import {
	dezerialize,
	zerialize,
} from 'zodex'

import type { ZodType } from 'zod'

/**
 * ****************************************************************************
 * TYPES
 * ****************************************************************************
 */
export type Validate = typeof z
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidateAnyType = ZodType<any, any, any>
export type ValidateErrorType = ZodError
export type ValidateInfer<O extends ValidateAnyType> = z.infer<O>
export type ValidateType<T> = ZodType<T>

/**
 * ****************************************************************************
 * FUNCTIONS
 * ****************************************************************************
 */

/**
 * Converts a validation error into a pretty string.
 * @param {unknown} error - The error to convert.
 * @returns {string} A pretty string representing the error.
 */
export const formatValidationError = ( error: unknown ) => {

	return fromError( error ).toString()

}

/**
 * Validate error class.
 * The validation functions are a wrapper of `zod` functions.
 * @see https://zod.dev/
 */
export const ValidateError = ZodError

/**
 * Create schema validation from js.
 * The validation functions are a wrapper of `zod` functions.
 * @see https://zod.dev/
 */
export const validate = z

/**
 * Serializes and simplifies types into a JSON format
 * @see https://www.npmjs.com/package/zodex?activeTab=readme
 */
export const serializeValidation = zerialize

/**
 * Deserializes
 * @see https://www.npmjs.com/package/zodex?activeTab=readme
 */
export const deserializeValidation = dezerialize

/**
 * Utility class for data validation.
 * Most of the validation functions are a wrapper of `zod` functions.
 * @see https://zod.dev/
 */
export class Validation {

	Error = ValidateError
	schema = validate
	formatError = formatValidationError
	serialize = zerialize
	deserialize = dezerialize

	/**
	 * Create a union of literal types from an array of strings.
	 * @param {string[]}values The values of the union.
	 * @returns {z.ZodUnion} A union of literal types.
	 * @example
	 * const myUnion = createLiteralUnion( ['one', 'two', 'three'] )
	 * // myUnion is a union of 'one', 'two', 'three'
	 */
	createLiteralUnion<T extends string>( values: T[] ) {

		// @ts-ignore
		return z.union( values.map( value => z.literal( value ) ) ) as unknown as z.ZodUnion<[
			z.ZodLiteral<T>,
			...z.ZodLiteral<T>[],
		]>

	}

}

