import { createValidateSchemaFn } from '@dovenv/utils'

import { TYPE }        from './const'
import { CheckConfig } from './types'
import { Command }     from '../_shared/main'

const checkFile = ( v :Command['utils']['validate'] ) => v.object( {
	desc        : v.string().optional(),
	type        : v.literal( TYPE.FILE ),
	patterns    : v.array( v.string() ).nonempty(),
	validateAll : v.function()
		.args(
			v.object( {
				paths : v.array( v.string() ),
				utils : v.any(),
			} ),
		)
		.returns( v.union( [ v.promise( v.void() ), v.void() ] ) )
		.optional(),
	validate : v.function()
		.args(
			v.object( {
				path    : v.string(),
				content : v.string().optional(),
				utils   : v.any(), // Asegurar compatibilidad con Command['utils']
			} ),
		)
		.returns( v.union( [ v.promise( v.void() ), v.void() ] ) )
		.optional(),
} ).strict()

const checkDir = ( v :Command['utils']['validate'] ) => v.object( {
	desc        : v.string().optional(),
	type        : v.literal( TYPE.DIR ),
	patterns    : v.array( v.string() ).nonempty(),
	validateAll : v.function()
		.args(
			v.object( {
				paths : v.array( v.string() ),
				utils : v.any(),
			} ),
		)
		.returns( v.union( [ v.promise( v.void() ), v.void() ] ) )
		.optional(),
	validate : v.function()
		.args(
			v.object( {
				path  : v.string(),
				utils : v.any(),
			} ),
		)
		.returns( v.union( [ v.promise( v.void() ), v.void() ] ) )
		.optional(),
} ).strict()

export const schema = createValidateSchemaFn<CheckConfig>( v =>
	v.record(
		v.string(),
		v.union( [
			checkFile( v ),
			checkDir( v ),

			v.object( {
				desc : v.string().optional(),
				type : v.literal( TYPE.CUSTOM ),
				fn   : v.function()
					.args(
						v.object( {
							utils : v.any(),
							run   : v.object( {
								file : v.function()
									.args( checkFile( v ) )
									.returns( v.union( [ v.promise( v.void() ), v.void() ] ) ),
								dir : v.function()
									.args( checkDir( v ) )
									.returns( v.union( [ v.promise( v.void() ), v.void() ] ) ),
							} ),
						} ),
					)
					.returns( v.union( [ v.promise( v.void() ), v.void() ] ) ), // Asegurar compatibilidad con Promise<void>
			} ).strict(),
		] ),
	),
)
