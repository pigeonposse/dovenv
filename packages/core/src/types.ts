/* eslint-disable @stylistic/object-curly-newline */

import type { CMD }             from './_shared/const'
import type { AliasesConfig }   from './core/aliases/main'
import type { CheckConfig }     from './core/check/main'
import type { ConstConfig }     from './core/const/main'
import type { TransformConfig } from './core/transform/main'
import type { CustomConfig }    from './custom/main'

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
	 * @see https://dovenv.pigeonposse.com/guide/core/config
	 */
	config? : Config
}
