import {
	defineConfig,
	Dovenv,
} from '@dovenv/core'
import {
	getCurrentDir,
	hideBin,
	joinPath,
	writeFile,
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
	examplesPlugin( { custom : {
		type : 'custom',
		fn   : async ( { run } ) => {

			let res = ''
			res    += '# Custom example configuration '
			res    += '\n\n'
			res    += await run.config( { input: joinPath( pluginDir, 'templates', 'examples', 'info.yml' ) } )
			res    += '\n\n'
			// res    += await run.jsdoc( { input: [ joinPath( pluginDir, 'templates', 'src', '*.ts' ) ] } )
			// res    += '\n\n'
			res += await run.path( {
				input : [ 'src/**/*.example.ts' ],
				opts  : { cwd: utilsDir },
			} )
			res += '\n\n'
			await writeFile( joinPath( buildDir, 'EXAMPLE_CUSTOM.md' ), res )
			return res

		},
	} } ),
)

// RUN DOVENV
const dovenv = new Dovenv( { config } )
const args   = hideBin( process.argv )

await dovenv.run( args )
