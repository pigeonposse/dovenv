import { validate } from '@dovenv/utils'

import type { CustomConfig } from './types'
import type {
	AssertEqual,
	ValidateInfer,
	ValidateType,
} from '@dovenv/utils'

type Validation = AssertEqual<keyof CustomConfig[number], keyof ValidateInfer<typeof schemaValue>>
type Valid = Validation extends true ?  ValidateInfer<typeof schemaValue> : never
type SchemaValidated = ValidateType<{ [key in string]: Valid }>

const schemaValue = validate.object( {
	desc : validate.string(),
	opts : validate.record(
		validate.string(),
		validate.object( { desc: validate.string() } ),
	).optional(),
	cmds : validate.record(
		validate.string(),
		validate.object( { desc: validate.string() } ),
	).optional(),
	examples : validate.array( validate.object( {
		desc : validate.string(),
		cmd  : validate.string(),
	} ) ).optional(),
	settings : validate.object( { wrapConsole: validate.boolean().optional() } ).optional(),
	fn       : validate.function()
		// .args( validate.object( {
		// 	cmds     : validate.array( validate.string() ).optional(),
		// 	opts     : validate.record( validate.string(), validate.unknown() ).optional(),
		// 	config   : validate.record( validate.string(), validate.unknown() ).optional(),
		// 	showHelp : validate.function()
		// 		.args( validate.string() )
		// 		.returns( validate.void() ).optional(),
		// } ).optional() )
		.returns( validate.promise( validate.void() ) ),
} )

export const schema: SchemaValidated = validate.record(
	validate.string(),
	schemaValue.strict( ),
)

