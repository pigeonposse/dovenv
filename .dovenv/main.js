import core                         from './const.js'
import { defineConfig }             from '../packages/core/dist/main.mjs'
import { pigeonposseMonorepoTheme } from '../packages/theme/pigeonposse/dist/main.mjs'

export default defineConfig(
	pigeonposseMonorepoTheme( {
		core,
		// must be added beacuse default value "dovenv lint eslint --fix --silent" because is not installed
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --fix --silent' } },
	} ),
)
