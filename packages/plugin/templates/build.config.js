import { defineBuildConfig } from 'unbuild'

import { config } from '../../config/repo-config/build.config'

export default defineBuildConfig( [
	{
		...config,
		entries   : [ './src/main' ],
		externals : [ '@dovenv/core' ],
	},
] )
