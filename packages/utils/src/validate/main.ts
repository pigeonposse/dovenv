import {
	z,
	ZodError,
} from 'zod'

import type { ZodType } from 'zod'

/**
 * ****************************************************************************
 * TYPES
 * ****************************************************************************
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidateType = ZodType<any, any, any>
export type ValidateErrorType = ZodError
export type ValidateInfer<O extends ValidateType> = z.infer<O>

/**
 * ****************************************************************************
 * FUNCTIONS
 * ****************************************************************************
 */

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
 * Utility class for data validation.
 * Most of the validation functions are a wrapper of `zod` functions.
 * @see https://zod.dev/
 */
export class Validation {

	Error = ValidateError
	schema = validate

	createLiteralUnion<T extends string>( values: T[] ) {

		// @ts-ignore
		return z.union( values.map( value => z.literal( value ) ) ) as unknown as z.ZodUnion<[
			z.ZodLiteral<T>,
			...z.ZodLiteral<T>[],
		]>

	}

}

