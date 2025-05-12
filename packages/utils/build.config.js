import { config } from '@dovenv/repo-config/unbuild'
import {
	URL,
	fileURLToPath,
} from 'node:url'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		alias : { '@': fileURLToPath( new URL( './src', import.meta.url ) ) },
	},
] )
