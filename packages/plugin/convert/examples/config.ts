import {
	getCurrentDir,
	joinPath,
} from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

const pkgDir = joinPath( getCurrentDir( import.meta.url ), '..', '..' )

export default defineConfig( config( {
	1 : {
		type   : 'jsdoc2md',
		input  : 'examples/recourses/jsdoc.js',
		output : 'build',
	},
	2 : {
		type   : 'md2html',
		input  : 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
		output : 'build',
	},
	3 : {
		type   : 'openapi2md',
		input  : 'https://raw.githubusercontent.com/Redocly/openapi-starter/refs/heads/main/openapi/openapi.yaml',
		output : 'build',
		opts   : { sort: true },
	},
	4 : {
		type   : 'ts2md',
		input  : joinPath( pkgDir, 'src', 'main.ts' ),
		output : 'build',
		opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_4' } },
	},
	5 : {
		type   : 'ts2md',
		input  : 'examples/recourses/file.ts',
		output : 'build',
		opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_5' } },
	},
}  ) )
