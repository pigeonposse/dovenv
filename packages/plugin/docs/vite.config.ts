/**
 * Vite config.
 * @description Vite config.
 * @see https://vitejs.dev/guide
 */

import { copyDir } from '@dovenv/utils'
import { resolve } from 'path'
// import { defineConfig } from 'vite'
import { build } from 'vite'
import dts       from 'vite-plugin-dts'

import { dependencies } from './package.json'

const target = 'node20'

const libraries = [
	{
		entry  : [ './src/main.ts', './src/cli.ts' ],
		outDir : 'dist',
	},
	{
		entry  : './src/.vitepress/config.ts',
		outDir : 'dist/.vitepress',
	},
]

for ( const libItem of libraries ) {

	await build( {
		esbuild : {
			platform : 'node',
			target,
		},
		configFile : false,
		build      : {
			ssr : true,
			target,
			lib : {
				entry   : libItem.entry,
				formats : [ 'es' ],
			},
			outDir        : libItem.outDir,
			// emptyOutDir   : false,
			rollupOptions : { external: Object.keys( dependencies ) },
		},
		plugins : [ dts( { rollupTypes: true } ) ],
	} )

}

await copyDir( {
	input  : resolve( 'src/.vitepress/theme' ),
	output : resolve( 'dist/.vitepress/theme' ),
} )

// export default defineConfig( {
// 	esbuild : {
// 		platform : 'node',
// 		target,
// 	},
// 	build : {
// 		ssr : true,
// 		target,
// 		lib : {
// 			entry : [
// 				'src/cli.ts',
// 				'src/main.ts',
// 				'src/.vitepress/config.ts',
// 			],
// 			fileName : ( format, entryName ) => {

// 				if ( entryName === 'src/.vitepress/config' ) return 'dist/.vitepress/config.js'
// 				return `${entryName}.${format}` // Para otros archivos, mantén el formato estándar

// 			},
// 			formats : [ 'es' ],
// 		},
// 		rollupOptions : { external: Object.keys( dependencies ) },
// 	},
// 	plugins : [
// 		dts( { rollupTypes: true } ),
// 		{
// 			name        : 'dovenv--post-build', // the name of your custom plugin. Could be anything.
// 			closeBundle : async () => {

// 				await copyDir( {
// 					input  : resolve( 'src/.vitepress/theme' ),
// 					output : resolve( 'dist/.vitepress/theme' ),
// 				} )

// 			},
// 		},
// 	],
// } )
