import { config }            from '@dovenv/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		entries   : [ './src/main',  './src/client' ],
		externals : [ 'ultimate-text-to-image', 'mdast' ],
	},
] )
