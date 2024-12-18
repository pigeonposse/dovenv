import {
	defineConfig,
	Dovenv,
} from '@dovenv/core'
import {
	getCurrentDir,
	hideBin,
	joinPath,
} from '@dovenv/core/utils'

import pkg            from '../../package.json'
import examplesPlugin from '../../src/main'

const currDir     = getCurrentDir( import.meta.url )
const pkgDir      = joinPath( currDir, '..', '..'  )
const wsDir       = joinPath( pkgDir, '..', '..', '..' )
const packagesDir = joinPath( wsDir, 'packages' )
const pluginDir   = joinPath( packagesDir, 'plugin' )
const utilsDir    = joinPath( packagesDir, 'utils' )
const buildDir    = joinPath( pkgDir, 'build', 'simple' )

const config = defineConfig(
	{ const : {
		pkg,
		wsDir,
	} },
	examplesPlugin( {
		config : {
			type   : 'config',
			input  : joinPath( pluginDir, 'templates', 'examples', 'info.yml' ),
			output : joinPath( buildDir, 'EXAMPLE_CONFIG.md' ),
		},
		path : {
			type   : 'path',
			input  : [ 'src/**/*.example.ts' ],
			opts   : { cwd: utilsDir },
			output : joinPath( buildDir, 'EXAMPLE_PATH.md' ),
		},
		// jsdoc : {
		// 	type   : 'jsdoc',
		// 	input  : [ joinPath( utilsDir, 'dist/*' ) ],
		// 	output : joinPath( buildDir, 'EXAMPLE_JSDOC.md' ),
		// },
	} ),
)

const dovenv = new Dovenv( { config } )
const args   = hideBin( process.argv )

await dovenv.run( args )
