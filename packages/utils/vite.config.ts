/**
 * Vite config.
 * @description Vite config.
 * @see https://vitejs.dev/guide
 */

import { defineConfig } from 'vite'
import dts              from 'vite-plugin-dts'

export const port = 13126
const target = 'node20'

export default defineConfig( {
	esbuild : {
		platform : 'node',
		target,
	},
	server  : { port },
	preview : { port },
	build   : {
		ssr : true,
		target,
		lib : {
			entry   : [ 'src/main.ts', 'src/client.ts' ],
			formats : [ 'es' ],
		},
	},
	plugins : [ dts( { rollupTypes: true } ) ],
} )
