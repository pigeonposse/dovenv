import { Dovenv }      from '@dovenv/core'
import { resolvePath } from '@dovenv/core/utils'

import aiPlugin from '../src/main'

const config = aiPlugin( { chat : { this : {
	input  : [ resolvePath( './src/*' ) ],
	theme  : 'custom',
	system : 'You are a code expert of this code.',
} } } )
const dovenv = new Dovenv( { config } )
const args   = process.argv.slice( 2 )

await dovenv.run( args )
