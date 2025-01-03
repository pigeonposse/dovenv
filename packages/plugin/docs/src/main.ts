
import { deepmergeCustom } from '@dovenv/core/utils'

import { getPkgConfig }   from './config/pkg'
import {
	docsPlugin,
	type DocsPluginConfig,
} from './plugin'
import { Docs } from './run'

import type { DocsConfig } from './config/types'

export type {
	DocsConfig,
	DocsPluginConfig,
}

export {
	getPkgConfig,
	Docs,
	docsPlugin,
}

export default docsPlugin

/**
 * Defines a configuration object for the dovenv documentation plugin.
 * @param {( DocsConfig | DocsConfig[] )[]} config - The configuration object.
 * @returns {DocsConfig} The defined configuration object.
 */
export const defineConfig = ( ...config: ( DocsConfig | DocsConfig[] )[] ) => {

	const mergeConfig = ( ...configs: DocsConfig[] ): DocsConfig =>
		deepmergeCustom<DocsConfig>( {} )( ...configs ) as DocsConfig
	if ( config.length === 1 ) {

		const [ single ] = config

		if ( Array.isArray( single ) )
			return mergeConfig( ...single )

		return single

	}

	return mergeConfig( ...( config as DocsConfig[] ) )

}
