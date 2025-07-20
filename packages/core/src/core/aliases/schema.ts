import { createValidateSchemaFn } from '@dovenv/utils'

import type { AliasesConfig } from './types'

export const schema = createValidateSchemaFn<AliasesConfig>( v => v.record(
	v.string(),
	v.strictObject( {
		desc : v.string(),
		cmd  : v.any(),
	} ),
) )
