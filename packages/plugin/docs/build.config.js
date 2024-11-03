import {
	copyDir,
	resolvePath as resolve,
} from '@dovenv/utils'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		entries : [
			'./src/main',
			'./src/cli',
			{
				input  : './src/.vitepress/config.ts',
				outDir : 'dist/.vitepress',
			},
		],

		sourcemap   : false,
		declaration : true,
		rollup      : { esbuild : {
			minify : false,
			target : 'node20',

		} },
		failOnWarn : false,
		hooks      : { 'build:done' : async () => {

			await copyDir( {
				input  : resolve( 'src/.vitepress/theme' ),
				output : resolve( 'dist/.vitepress/theme' ),
			} )

		} },

	},
] )

