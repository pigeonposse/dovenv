import type { getPaths } from '@dovenv/core/utils'

export type Config = {
	/** Id  of the TODO */
	[key in string]: {
		/**
		 Input pattern for get TODOs
		 */
		input       : string[]
		/**
		 * Output for add all TODOs in markdown format.
		 * Override if exists content.
		 * @example undefined
		 */
		output?     : string
		/**
		 * Options for get TODOs
		 * @default
		 * {
		 *   gitignore : true,
		 *   onlyFiles : true,
		 *   dot       : true,
		 * }
		 */
		inputOpts?  : Parameters<typeof getPaths>[1]
		/**
		 * custom tags to get TODOs
		 * @default
		 * [ 'TODO', '@todo', '@fixme' ]
		 */
		customTags? : string[]
	}
}
