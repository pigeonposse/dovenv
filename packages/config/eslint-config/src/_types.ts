/* eslint-disable @stylistic/object-curly-newline */
import type { Linter } from 'eslint'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any

export type Config = Linter.Config

export type ConfigParamsSuper = {
	/**
	 * Custom rules.
	 */
	rules? : Config['rules']
}
