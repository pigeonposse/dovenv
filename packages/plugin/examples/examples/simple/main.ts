import { Dovenv }  from '@dovenv/core'
import { hideBin } from '@dovenv/core/utils'

import config from './config'

// Run dovenv
const dovenv = new Dovenv( { config } )
await dovenv.run( hideBin( process.argv ) )
