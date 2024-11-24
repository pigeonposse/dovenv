import { Todo } from './core/main'

import type { Config }                  from './core/types'
import type { Config as DoveEnvConfig } from '@dovenv/core'

export { Todo }
export const config = ( conf?: Config ): DoveEnvConfig => {

	const todo = new Todo( conf )

	return { custom : { todo : {
		desc : 'Toolkit for Workspace TODOs',
		opts : { key : {
			alias : 'k',
			desc  : 'Key pattern to get TODOs',
			type  : 'array',
		} },
		fn : async ( { opts } ) => {

			const keys = opts?.key as string[] | undefined
			await todo.run( keys )

		},
	} } }

}

