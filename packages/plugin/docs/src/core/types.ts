import type { DocsConfig }   from '../config/types'
import type { CommandUtils } from '@dovenv/core'

type Response<T> = Promise<T> | T
export type Config = DocsConfig | ( ( utils: CommandUtils ) => Response<DocsConfig> )
export type DocsParams = {
	config? : Config
	utils   : CommandUtils
	opts?  : {
		packageJsonPath? : string
		configPath?      : string
		debug?           : boolean
		port?            : number
	}
}
