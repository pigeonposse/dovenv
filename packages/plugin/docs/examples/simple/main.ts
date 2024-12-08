
import { Dovenv } from '@dovenv/core'
import {
	getCurrentDir,
	hideBin,
	joinPath,
} from '@dovenv/core/utils'

// Is import to add config as a param for use theN DOVENV_CONFIG_PATH

const dovenv  = new Dovenv( )
const args    = hideBin( process.argv )
const currDir = joinPath( getCurrentDir( import.meta.url ) )

await dovenv.run( [
	'-c',
	joinPath( currDir, 'config.ts' ),
	...args,
] )
