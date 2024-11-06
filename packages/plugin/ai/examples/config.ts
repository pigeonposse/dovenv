import { resolvePath }  from '@dovenv/utils'
import { defineConfig } from 'dovenv'

import { config } from '../src/main'

const src = resolvePath( './src/*' )

export default defineConfig( config( { chat : { this : {
	input  : [ src ],
	theme  : 'custom',
	system : 'You are a code expert of this code.',
} } } ) )
