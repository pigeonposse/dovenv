import { createValidateSchemaFn } from '@dovenv/utils'

import { TransformConfig } from './types'

export const schema = createValidateSchemaFn<TransformConfig>( v => v.record(
	v.string(),
	v.strictObject( {
		desc  : v.string().optional(),
		input : v.array( v.string() ).nonempty(),
		fn    : v.any(),
	} ),
) )

