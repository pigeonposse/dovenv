import { defineConfig } from 'dovenv'

import { config } from '../src/main'

export default defineConfig( config( {
	1 : {
		type   : 'jsdoc2md',
		input  : 'examples/jsdoc.js',
		output : 'build',
	},
	2 : {
		type   : 'md2html',
		input  : 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
		output : 'build/',
	},
	3 : {
		type   : 'openapi2md',
		input  : 'https://raw.githubusercontent.com/Redocly/openapi-starter/refs/heads/main/openapi/openapi.yaml',
		output : 'build/openapi.md',
		sort   : true,
	},
}  ) )
