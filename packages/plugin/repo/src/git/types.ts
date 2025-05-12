/* eslint-disable @stylistic/object-curly-newline */
import type { Config } from '../_super/types'

export type GitConfig = Config & {
	/** Commit configuration */
	commit? : {
		/**
		 * Type of commit message.
		 * Add types for your commits.
		 *
		 * @example
		 * [
		 *   {value: 'feat', title: 'A new feature'},
		 *   {value: 'fix', title: 'A bug fix'}
		 * ]
		 */
		types? : Array<{
			value  : string
			title? : string
			desc?  : string
		}>
		/**
		 * Scope of commit message.
		 *
		 * @example
		 * [
		 * 	{value: 'core'},
		 * 	{value: 'package'},
		 * 	{value: 'env'},
		 * 	{value: 'all'}
		 * ]
		 */
		scopes?: Array<{
			value  : string
			title? : string
			desc?  : string
		}>
	}
	/** Pull configuration */
	pull?  : unknown
	/**Push configuration */
	push?  : unknown
	/**Husky configuration
	 * @link https://typicode.github.io/husky/
	 */
	husky?  : {
		/**
		 * The path to set the '.husky' directory.
		 *
		 * @default '.dovenv/.husky'
		 */
		path : string
	}
}
