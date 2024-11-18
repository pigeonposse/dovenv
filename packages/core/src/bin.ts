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

const exec = async  () => {

	rmDeprecationAlerts()

	const up = updateNotifier( name, version )
	up.notify()

	await run( process.argv )

}

exec()
