import { createValidateSchemaFn } from '@dovenv/utils'

import type { ConstConfig } from './types'
import type { Command }     from '../_shared/main'

const ConstValueSchema = ( v: Command['utils']['validate'] ) => v.union( [
	v.string(),
	v.number(),
	v.boolean(),
	v.record( v.string(), v.unknown() ),
] )

export const schema = createValidateSchemaFn<ConstConfig>( v =>
	v.record(
		v.string(),
		v.union( [ ConstValueSchema( v ), v.any() ] ),
	),
)

