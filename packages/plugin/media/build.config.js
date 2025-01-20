import { config }            from '../../config/repo-config/build.config'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		entries   : [ './src/main' ],
		externals : [ '@dovenv/core' ],
	},
] )
