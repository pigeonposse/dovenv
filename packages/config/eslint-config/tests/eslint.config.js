import { defineConfig } from 'eslint/config'

import * as dovenv from '../dist/main.mjs'

const svelteConf = await dovenv.setSvelteConfig( { ts: true } )

export default defineConfig( [
	...dovenv.config,
	...dovenv.cssConfig,
	...svelteConf,
	...dovenv.vueConfig,
	{ ignores: [ './package.json' ] },
] )
