/* eslint-disable @stylistic/object-curly-newline */
import type { Config } from '../_super/types'

export type GitConfig = Config & {
	commit? : {
		types? : Array<{
			value  : string
			title? : string
			desc?  : string
		}>
		scopes?: Array<{
			value  : string
			title? : string
			desc?  : string
		}>
		/**
		 * Lint commit message after complete.
		 * For use this is necessary have plugin '@dovenv/lint' in your project
		 * @default false
		 */
		lint? : boolean
	}
	pull?  : unknown
	push?  : unknown
	husky?  : {
		/**
		 * The path to set the '.husky' directory
		 * @default '.dovenv/.husky'
		 */
		path : string
	}
}
