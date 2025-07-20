import { createValidateSchemaFn } from '@dovenv/utils'

import type { CustomConfig } from './types'

export const schema = createValidateSchemaFn<CustomConfig>( v => v.record(
	v.string(),
	v.object( {
		desc : v.string(),
		opts : v.record(
			v.string(),
			v.object( { desc: v.string() } ),
		).optional(),
		cmds : v.record(
			v.string(),
			v.object( { desc: v.string() } ),
		).optional(),
		examples : v.array( v.object( {
			desc : v.string(),
			cmd  : v.string(),
		} ) ).optional(),
		settings : v.object( {
			wrapConsole : v.boolean().optional(),
			hide        : v.boolean().optional(),
		} ).optional(),
		fn : v.any(),
	} ).strict( ),
) )

