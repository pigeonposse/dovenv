import { createValidateSchemaFn } from '@dovenv/utils'

import { ConstConfig }    from './types'
import { Command }        from '../_shared/main'
import { responseSchema } from '../_shared/schema'

const ConstValueSchema = ( v: Command['utils']['validate'] ) => v.union( [
	v.string(),
	v.number(),
	v.boolean(),
	v.record( v.string(), v.unknown() ),
] )

export const schema = createValidateSchemaFn<ConstConfig>( v =>
	v.record(
		v.string(),
		v.union( [ ConstValueSchema( v ), v.function().returns( responseSchema( ConstValueSchema( v ), v ) ) ] ),
	),
)

