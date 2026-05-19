import { defineConfig } from 'eslint/config'

import * as dovenv from '../src/main'

const svelteConf = await dovenv.setSvelteConfig( { ts: true } )
const config     = defineConfig( [
	...dovenv.config,
	...dovenv.cssConfig,
	...svelteConf,
	...dovenv.vueConfig,
] )

// console.dir( config, { depth: null } )

export default config
