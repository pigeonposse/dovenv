import { config } from '@dovenv/repo-config/unbuild'
import {
	URL,
	fileURLToPath,
} from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		failOnWarn  : false,
		declaration : 'compatible',
		alias       : { '@': fileURLToPath( new URL( './src', import.meta.url ) ) },
	},
] )
