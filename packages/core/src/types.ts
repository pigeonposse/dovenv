/* eslint-disable @stylistic/object-curly-newline */

import type { CMD }             from './_shared/const'
import type { AliasesConfig }   from './core/aliases/types'
import type { CheckConfig }     from './core/check/types'
import type { ConstConfig }     from './core/const/types'
import type { TransformConfig } from './core/transform/types'
import type { CustomConfig }    from './custom/types'

export type Config = {
	/**
	 * Name of the project
	 */
	name?            : string
	/**
	 * Description of the project
	 */
	desc?            : string
	/**
	 * Configuration for create `custom` commands
	 */
	custom?          : CustomConfig
	/**
	 * Configuration for the `check` command
	 */
	[CMD.CHECK]?     : CheckConfig
	/**
	 * Configuration for set the constants used in templates
	 */
	[CMD.CONSTANTS]? : ConstConfig
	/**
	 * Configuration for the `transform` command
	 */
	[CMD.TRANSFORM]? : TransformConfig
	/**
	 * Configuration for the `aliases`
	 */
	[CMD.ALIASES]?   : AliasesConfig
}

export type Params = {
	/**
	 * Configuration for dovenv
	 * @see https://dovenv.pigeonposse.com/guide/core/api#config
	 */
	config? : Config
}
