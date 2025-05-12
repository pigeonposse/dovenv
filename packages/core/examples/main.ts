import {
	getCurrentDir,
	hideBin,
	joinPath,
} from '@dovenv/utils'
import process from 'node:process'

import config     from './config'
import { Dovenv } from '../src/main'

const dovenv = new Dovenv( { config } )

// In a JS instance of DOVENV, dovenvConfigPath will be undefined, so you can set the config path manually
// 'dovenvConfigPath' property is used for user information purposes only
dovenv.dovenvConfigPath = joinPath( getCurrentDir( import.meta.url ), 'config.ts' )

await dovenv.run( hideBin( process.argv ) )
