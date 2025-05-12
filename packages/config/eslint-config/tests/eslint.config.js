import * as dovenv from '../dist/main.mjs'

export default [
	...dovenv.config,
	...dovenv.cssConfig,
	...dovenv.setSvelteConfig( { ts: true } ),
	...dovenv.vueConfig,
]
