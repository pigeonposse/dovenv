
import { hideBin } from '@dovenv/utils'

import config     from './config'
import { Dovenv } from '../src/main'

const dovenv = new Dovenv( { config } )
const args   = hideBin( process.argv )

await dovenv.run( args )
