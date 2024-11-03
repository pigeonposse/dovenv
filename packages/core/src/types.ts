
import type { CheckConfig }     from './check/main'
import type { ConstConfig }     from './const/main'
import type { CustomConfig }    from './custom/main'
import type { TemplateConfig }  from './template/main'
import type { TransformConfig } from './transform/main'

export type Config = {
	/**
	 * Name of the project
	 */
	name?      : string
	/**
	 * Description of the project
	 */
	desc?      : string
	/**
	 * Configuration for the `check` command
	 */
	check?     : CheckConfig
	/**
	 * Configuration for set the constants used in templates
	 */
	const?     : ConstConfig
	/**
	 * Configuration for the `template` command
	 */
	template?  : TemplateConfig
	/**
	 * Configuration for create `custom` commands
	 */
	custom?    : CustomConfig
	/**
	 * Configuration for the `transform` command
	 */
	transform? : TransformConfig
}
