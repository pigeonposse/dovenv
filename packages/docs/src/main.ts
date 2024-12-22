
import { Dovenv } from '@dovenv/core'
import {
	getCurrentDir,
	hideBin,
} from '@dovenv/core/utils'

import config       from './config'
import { joinPath } from '../../utils/src/sys/main'

const dovenv            = new Dovenv( { config } )
const args              = hideBin( process.argv )
const currentFilePath   = joinPath( getCurrentDir( import.meta.url ), 'config.ts' )
dovenv.dovenvConfigPath = currentFilePath
await dovenv.run( args )
