import { hideBin } from '@dovenv/core/utils'
import { Dovenv }  from '@dovenv/core'

import config from './config'

const dovenv = new Dovenv( { config } )
const args   = hideBin( process.argv )

await dovenv.run( args )
