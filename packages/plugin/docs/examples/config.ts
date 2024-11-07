import {
	getCurrentDir,
	joinPath,
} from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

const configPath = joinPath( getCurrentDir( import.meta.url ), 'docs.config.js' )

export default defineConfig( config( { configPath } ) )
