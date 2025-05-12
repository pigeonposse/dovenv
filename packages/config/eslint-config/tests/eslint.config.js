import * as dovenv from '../dist/main.mjs'

const svelteConf = await dovenv.setSvelteConfig( { ts: true } )

export default [
	...dovenv.config,
	...dovenv.cssConfig,
	...svelteConf,
	...dovenv.vueConfig,
]
