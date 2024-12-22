import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import pkg            from '../../package.json'
import examplesPlugin from '../../src/main'

const currDir = getCurrentDir( import.meta.url )
const pkgDir  = joinPath( currDir, '..', '..'  ) // Your package dir
const wsDir   = joinPath( pkgDir, '..', '..', '..' ) // Your workspace dir (if you are in a monorepo)

const packagesDir = joinPath( wsDir, 'packages' )
const pluginDir   = joinPath( packagesDir, 'plugin' )
const utilsDir    = joinPath( packagesDir, 'utils' )
const buildDir    = joinPath( pkgDir, 'build', 'simple' )

export default defineConfig(
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
