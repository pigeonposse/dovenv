import {
	getCurrentDir,
	joinPath,
} from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

const pluginDir = joinPath( getCurrentDir( import.meta.url ), '..'  )
const wsDir     = joinPath( pluginDir, '..', '..', '..' )

export default defineConfig( config( { all : {
	input     : [ joinPath( wsDir, '**/*.{js,ts,md}' ) ],
	output    : joinPath( pluginDir, 'TODO.md' ),
	inputOpts : {
		gitignore : true,

		cwd : wsDir,
	},
} } ) )
