import { resolvePath }  from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

const configPath = resolvePath( './config.js' )

export default defineConfig( config( { configPath } ) )
