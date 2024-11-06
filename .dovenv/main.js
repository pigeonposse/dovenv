import { defineConfig } from '../packages/core/dist/main.mjs'
import { config }       from '../packages/templates/banda/dist/main.mjs'

export default defineConfig( [
	{
		name : 'DOVENV MONOREPO',
		desc : 'Configuration for dovenv monorepo that uses the dovenv core andBANDA template.',
	},
	config(),
] )
