import { config }          from '@dovenv/repo-config/unbuild'
import {
	copyDir,
	resolvePath as resolve,
} from '@dovenv/utils'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		...config,
		entries : [
			'./src/main',
			'./src/bin',
			{
				input  : './src/.vitepress/config.ts',
				outDir : 'dist/.vitepress',
			},
		],
		hooks : { 'build:done' : async () => {

			await copyDir( {
				input  : resolve( 'src/.vitepress/theme' ),
				output : resolve( 'dist/.vitepress/theme' ),
			} )

		} },
		externals : [ '@dovenv/core' ],
	},
] )

