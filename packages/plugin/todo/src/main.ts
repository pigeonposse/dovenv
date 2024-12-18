import { Todo } from './core/main'

import type { Config }                 from './core/types'
import type { Config as DovenvConfig } from '@dovenv/core'

export {
	Todo,
	Config,
}

/**
 * A plugin for dovenv to get TODOs in a workspace.
 * @param {Config} [conf] - Configuration for the plugin.
 * @returns {DovenvConfig} - The plugin.
 * import { defineConfig } from '@dovenv/core'
 * import { todoPlugin } from '@dovenv/todo'
 * export default defineConfig(
 *     todoPlugin( {
 *       example : {
 *         input : [ 'src/*.{ts,tsx,js,jsx,md}' ],
 *       },
 *     } ),
 * )
 */
export const todoPlugin = ( conf?: Config ): DovenvConfig => {

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

export default todoPlugin
