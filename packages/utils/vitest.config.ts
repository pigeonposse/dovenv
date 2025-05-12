import path             from 'node:path'
import { defineConfig } from 'vitest/config'

import tsconfig from './tsconfig.json'

// Create an alias object from the paths in tsconfig.json
const alias = Object.fromEntries(
	Object.entries( tsconfig.compilerOptions.paths ).map( ( [ key, [ value ] ] ) =>
		[ key.replace( '/*', '' ), path.resolve( __dirname, value.replace( '/*', '' ) ) ],
	),
)

export default defineConfig( { resolve: { alias } } )
