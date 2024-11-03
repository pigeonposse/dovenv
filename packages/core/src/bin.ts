import {
	process,
	rmDeprecationAlerts,
} from '@dovenv/utils'

import { run } from './cli'
import {
	name,
	version,
} from '../package.json'
import { updateNotifier } from './_shared/up'

const up = updateNotifier( name, version )
up.notify()

rmDeprecationAlerts()

await run( process.argv )
