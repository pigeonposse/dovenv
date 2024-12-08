
import { customConfig }               from './cmds.js'
import { coreConfig }                 from './core.js'
import docs                           from './docs.js'
import readmes                        from './readmes.js'
import { defineConfig }               from '../packages/core/dist/main.mjs'
import { config as pigeonposseTheme } from '../packages/theme/pigeonposse/dist/main.mjs'

export default defineConfig(
	coreConfig,
	customConfig,
	readmes,
	pigeonposseTheme( {
		...docs,
		lint : { staged: { '**/*.{js,ts,jsx,tsx,json}': 'pnpm --silent . lint eslint --silent' } },
		repo : { commit : { scopes : [
			{
				value : 'core',
				desc  : 'Core package',
			},
			{
				value : 'plugin',
				desc  : 'Plugin package(s)',
			},
			{
				value : 'theme',
				desc  : 'Theme package',
			},
			{
				value : 'utils',
				desc  : 'Utils package',
			},
			{
				value : 'all',
				desc  : 'All packages',
			},
			{
				value : 'env',
				desc  : 'Only development environment',
			},
		] } },
	} ),
)
