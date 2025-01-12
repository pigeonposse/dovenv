import core                         from './const.js'
import { defineConfig }             from '../packages/core/dist/main.mjs'
import { pigeonposseMonorepoTheme } from '../packages/theme/pigeonposse/dist/main.mjs'

export default defineConfig(
	// { check : { example : {
	// 	desc     : 'Repo packages structure.',
	// 	type     : 'dir',
	// 	patterns : [
	// 		'./packages/*',
	// 		'!./packages/{plugin,config,theme}',
	// 		'./packages/{plugin,config,theme}/*',
	// 	],
	// 	validateAll() {

	// 		// throw Error( 'Forced error' )

	// 	},
	// } } },
	pigeonposseMonorepoTheme( {
		core,
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --fix --silent' } },

	} ),
)
