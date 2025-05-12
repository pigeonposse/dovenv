import { createValidateSchemaFn } from '@dovenv/utils'

import { AliasesConfig }  from './types'
import { responseSchema } from '../_shared/schema'

export const schema = createValidateSchemaFn<AliasesConfig>( v => v.record(
	v.string(),
	v.object( {
		desc : v.string(),
		cmd  : v.string()
			.or(
				v.function()
					.returns( responseSchema( v.void(), v ) ),
			),
	} ).strict(),
) )
