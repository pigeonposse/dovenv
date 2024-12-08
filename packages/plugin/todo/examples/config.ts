import { defineConfig } from '@dovenv/core'
import {
	getCurrentDir,
	joinPath,
} from '@dovenv/core/utils'

import { config } from '../src/main'

const pluginDir = joinPath( getCurrentDir( import.meta.url ), '..'  )
const wsDir     = joinPath( pluginDir, '..', '..', '..' )

// const buildDir  = joinPath( pluginDir, 'build' )
export default defineConfig( config( {
	all : {
		input     : [ joinPath( wsDir, '**/*.{ts,tsx,js,jsx,md}' ) ],
		// output    : joinPath( buildDir, 'TODO.md' ),
		inputOpts : { cwd: wsDir },
	},
	docs : {
		input      : [ joinPath( wsDir, 'docs/**/*.md' ) ],
		// output    : joinPath( buildDir, 'TODO.md' ),
		customTags : [ '\\- \\[ \\] \\s*' ],
		inputOpts  : { cwd: wsDir },
	},
} ) )
