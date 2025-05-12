
import { createMergeDataFn } from '@dovenv/core/utils'

import { autoPWAConfig } from './config/default'
import { getPkgConfig }  from './config/pkg'
import { docs }          from './lib'
import { docsPlugin }    from './plugin'

import type { DocsConfig } from './config/types'
import type {
	DocsParams,
	Config,
} from './core/types'

export type {
	DocsConfig,
	DocsParams,
	Config,
}

export {
	docs,
	docsPlugin,
	autoPWAConfig,
	getPkgConfig,
}

export default docsPlugin

/**
 * Defines a configuration object for the dovenv documentation plugin.
 *
 * @param   {( DocsConfig | DocsConfig[] )[]} config - The configuration object.
 * @returns {DocsConfig}                             The defined configuration object.
 */
export const defineConfig = createMergeDataFn<DocsConfig>()

