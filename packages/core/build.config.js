import { config }            from '@dovenv/repo-config/unbuild'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		entries : [
			'./src/main',
			'./src/bin',
			'./src/utils',
		],
		externals : [
			'zod',
			'yargs',
			'ora',
			'deepmerge-ts',
			'consola',
		],
	},
] )

