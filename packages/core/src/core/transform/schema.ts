import { createValidateSchemaFn } from '@dovenv/utils'

import { TransformConfig } from './types'
import { responseSchema }  from '../_shared/schema'

export const schema = createValidateSchemaFn<TransformConfig>( v => v.record(
	v.string(),
	v.object( {
		desc: v.string().optional(),
		input : v.array( v.string() ).nonempty(),
		fn    : v.function()
			.args( v.object( {
				path    : v.string(),
				content : v.string().optional(),
				const   : v.any(),
			} ) )
			.returns( responseSchema( v.union( [
				v.string(),
				v.void(),
				v.undefined(),
			] ), v ) ),
	} ).strict(),
) )

