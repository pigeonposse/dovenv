import { config }            from '@dovenv/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

import pkg from '../utils/package.json'

export default defineBuildConfig( [
	{
		...config,
		externals : [ ...( Object.keys( pkg.dependencies ) ), ...( Object.keys( pkg.devDependencies ) ) ],
	},
] )

