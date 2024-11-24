import {
	process,
	hideBin,
} from '@dovenv/utils'

import { Dovenv } from './cli'
import {
	name,
	version,
} from '../package.json'
import { updateNotifier } from './_shared/up'

const exec = async  () => {

	const up = updateNotifier( name, version )
	up.notify()
	const args   = hideBin( process.argv )
	const dovenv = new Dovenv()
	await dovenv.run(  args )

}

exec()
