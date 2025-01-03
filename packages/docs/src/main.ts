
import { Dovenv } from '@dovenv/core'
import {
	getCurrentDir,
	hideBin,
	joinPath,
} from '@dovenv/core/utils'

import config from './config'

const args            = hideBin( process.argv )
const currentFilePath = joinPath( getCurrentDir( import.meta.url ), 'config.ts' )

const dovenv = new Dovenv( { config } )

dovenv.dovenvConfigPath = currentFilePath
await dovenv.run( args )
