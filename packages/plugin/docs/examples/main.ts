
import { hideBin } from '@dovenv/utils'
import { Dovenv }  from 'dovenv'

import config from './config'

const dovenv = new Dovenv( { config } )
const args   = hideBin( process.argv )

await dovenv.run( args )
