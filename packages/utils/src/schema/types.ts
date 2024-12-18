
import type { ValidateAnyType } from '../validate/main'
import type {
	Options,
	compile,
} from 'json-schema-to-typescript-lite'
import type { Options as Schema2ZodOpts } from 'json-schema-to-zod'
import type { Config as Ts2schemaConf }   from 'ts-json-schema-generator'
import type { Options as Zod2JsonOpts }   from 'zod-to-json-schema'

export type schemaString = Parameters<typeof compile>[0]
export type SchemaObject = Parameters<typeof compile>[0] | object

export type Ts2Schema = { config: Ts2schemaConf }
export type Zod2schema = {
	/**
	 * The JSON Schema object to convert to a TypeScript type.
	 * It can be directly passed as an object or as the first parameter of the `compile` function.
	 */
	schema : ValidateAnyType
	/**
	 * Options for convert process
	 */
	opts?  : Zod2JsonOpts
}
export type Schema2zod = {
	/**
	 * The JSON Schema object to convert to a TypeScript type.
	 * It can be directly passed as an object or as the first parameter of the `compile` function.
	 */
	schema : SchemaObject
	/**
	 * Options for convert process
	 */
	opts?  : Schema2ZodOpts
}

export type Schema2tsProps = {
	/**
	 * The name of the TypeScript type to be generated.
	 * This will appear as the interface or type name in the output.
	 */
	name   : string
	/**
	 * The JSON Schema object to convert to a TypeScript type.
	 * It can be directly passed as an object or as the first parameter of the `compile` function.
	 */
	schema : SchemaObject
	/**
	 * Optional compilation options to customize the output TypeScript type.
	 * These options are passed to the `json-schema-to-typescript` library.
	 */
	opts?  : Options
}

export type Schema2typeProps = Pick<Schema2tsProps, 'schema'> & {
	/**
	 * Remove all `?` from the generated type
	 * @default false
	 */
	required?        : boolean
	/**
	 * Remove all `[k: string]: unknown` from the generated type
	 * @default false
	 */
	noUnknownObject? : boolean
}
