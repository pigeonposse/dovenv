import {
	getCurrentDir,
	hideBin,
} from '@dovenv/utils'

import config       from './config'
import { joinPath } from '../../utils/src/sys/main'
import { Dovenv }   from '../src/main'

const dovenv = new Dovenv( { config } )

// In a JS instance of DOVENV, dovenvConfigPath will be undefined, so you can set the config path manually
// 'dovenvConfigPath' property is used for user information purposes only
dovenv.dovenvConfigPath = joinPath( getCurrentDir( import.meta.url ), 'config.ts' )

await dovenv.run( hideBin( process.argv ) )
