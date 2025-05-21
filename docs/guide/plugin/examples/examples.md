# `@dovenv/examples` - Examples

## Simple example

This is a simple example for create examples files

### Dovenv configuration file

```ts
import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import pkg            from '../../package.json'
import examplesPlugin from '../../src/main'

const currDir = getCurrentDir( import.meta.url )
const pkgDir  = joinPath( currDir, '..', '..' ) // Your package dir
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
		jsdoc : {
			type   : 'jsdoc',
			input  : [ joinPath( utilsDir, 'dist/*.mts' ) ],
			output : joinPath( buildDir, 'EXAMPLE_JSDOC.md' ),
		},
	} ),
)

```

### Run dovenv in a TS file

```ts
import { Dovenv }  from '@dovenv/core'
import { hideBin } from '@dovenv/core/utils'

import config from './config'

// Run dovenv
const dovenv = new Dovenv( { config } )
await dovenv.run( hideBin( process.argv ) )

```

### Use in CLI

```bash
dovenv -c config.ts examples
```



## Custom example

This is a example that use the custom type for create example files

### Dovenv configuration file

```ts
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
const pkgDir      = joinPath( currDir, '..', '..' )
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

```

### Use in CLI

```bash
dovenv -c config.ts examples -k custom
```



