import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import convertPlugin from '../../src/main'

const pkgDir = joinPath( getCurrentDir( import.meta.url ), '..', '..' )
const input  = 'examples/simple/recourses/file.ts'
export default defineConfig( { const: { pkgDir } }, convertPlugin( {
	1 : {
		type   : 'jsdoc2md',
		input  : 'examples/recourses/jsdoc.js',
		output : 'build/1',
		opts   : {},
	},
	2 : {
		type   : 'md2html',
		input  : 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
		output : 'build/2',
	},
	3 : {
		type   : 'openapi2md',
		input  : 'https://raw.githubusercontent.com/Redocly/openapi-starter/refs/heads/main/openapi/openapi.yaml',
		output : 'build/3',
		opts   : { sort: true },
	},
	4 : {
		type   : 'ts2md',
		input  : 'src/main.ts', //joinPath( pkgDir, 'src', 'main.ts' ),
		output : 'build/4',
		opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_4' } },
	},
	5 : {
		type   : 'ts2md',
		input,
		output : 'build/5',
		opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_5' } },
	},
	6 : {
		type : 'custom',
		fn   : async ( {
			run, config,
		} ) => {

			if ( !( config.const?.pkgDir && typeof config.const.pkgDir === 'string' ) ) throw Error( 'Must exist pkgDir const' )

			await run.ts2md( {
				input  : joinPath( config.const.pkgDir, input ),
				output : 'build/6',
				opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_6' } },
			} )

		},
	},
} ) )
