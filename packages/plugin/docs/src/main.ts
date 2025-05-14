
import { autoPWAConfig } from './.vitepress/pwa'
import { defineConfig }  from './config'
import { getPkgConfig }  from './config/pkg'
import { docs }          from './core'
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
	defineConfig,
}

export default docsPlugin

