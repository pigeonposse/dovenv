import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig( [
	{
		entries     : [ './src/main', './src/client' ],
		sourcemap   : false,
		declaration : true,
		rollup      : { esbuild : {
			minify : true,
			target : 'node20',
		} },
		failOnWarn : false,

	},
] )
