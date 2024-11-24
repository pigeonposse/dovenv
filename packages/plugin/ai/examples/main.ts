import { resolvePath } from '@dovenv/utils'
import { Dovenv }      from 'dovenv'

import { config as plugin } from '../src/main'

const config = plugin( { chat : { this : {
	input  : [ resolvePath( './src/*' ) ],
	theme  : 'custom',
	system : 'You are a code expert of this code.',
} } } )
const dovenv = new Dovenv( { config } )
const args   = process.argv.slice( 2 )

await dovenv.run( args )
