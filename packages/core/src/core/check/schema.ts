import { createValidateSchemaFn } from '@dovenv/utils'

import { TYPE } from './const'

import type {
	CheckConfig,
	CheckCustomConfig,
	CheckDirConfig,
	CheckFileConfig,
} from './types'

const checkFile   = createValidateSchemaFn<CheckFileConfig>( v => v.object( {
	title       : v.string().optional(),
	desc        : v.string().optional(),
	type        : v.literal( TYPE.FILE ),
	patterns    : v.array( v.string() ).nonempty(),
	validateAll : v.any(),
	validate    : v.any(),
} ) )
const checkDir    = createValidateSchemaFn<CheckDirConfig>( v => v.strictObject( {
	title       : v.string().optional(),
	desc        : v.string().optional(),
	type        : v.literal( TYPE.DIR ),
	patterns    : v.array( v.string() ).nonempty(),
	validateAll : v.any(),
	validate    : v.any(),
} ) )
const checkCustom = createValidateSchemaFn<CheckCustomConfig>( v => v.strictObject( {
	title : v.string().optional(),
	desc  : v.string().optional(),
	type  : v.literal( TYPE.CUSTOM ),
	fn    : v.any(),
} ) )
export const schema = createValidateSchemaFn<CheckConfig>( v => v.record(
	v.string(),
	v.union( [
		checkFile( v ),
		checkDir( v ),
		checkCustom( v ),
	] ),
),
)
