import { defineConfig } from '@dovenv/core'
// import {
// 	getCurrentDir,
// 	joinPath,
// } from '@dovenv/core/utils'

import { config } from '../src/main'

// const pkgDir = joinPath( getCurrentDir( import.meta.url ), '..', '..' )

export default defineConfig( config( {
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
		input  : 'examples/recourses/file.ts',
		output : 'build/5',
		opts   : { typedocMarkdown: { entryFileName: 'EXAMPLE_5' } },
	},
}  ) )
