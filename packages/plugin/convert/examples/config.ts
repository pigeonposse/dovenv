import { defineConfig } from 'dovenv'

import { config } from '../src/main'

export default defineConfig( config( {
	1 : {
		in  : 'examples/jsdoc.js',
		out : 'build/test.md',

	},
	2 : {
		in  : 'https://raw.githubusercontent.com/pigeonposse/backan/refs/heads/main/README.md',
		out : 'build/test.html',
	},
	3 : {
		in  : 'https://raw.githubusercontent.com/Redocly/openapi-starter/refs/heads/main/openapi/openapi.yaml',
		out : 'build/openapi.md',
	},
}  ) )
