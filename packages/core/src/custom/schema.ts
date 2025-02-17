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
		settings : v.object( { wrapConsole: v.boolean().optional() } ).optional(),
		fn       : v.function()
			// .args( v.object( {
			// 	cmds     : v.array( v.string() ).optional(),
			// 	opts     : v.record( v.string(), v.unknown() ).optional(),
			// 	config   : v.record( v.string(), v.unknown() ).optional(),
			// 	showHelp : v.function()
			// 		.args( v.string() )
			// 		.returns( v.void() ).optional(),
			// } ).optional() )
			.returns( v.promise( v.void() ) ),
	} ).strict( ),
) )

