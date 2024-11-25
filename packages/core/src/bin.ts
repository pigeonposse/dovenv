import {
	process,
	hideBin,
	deprecatedAlerts,
} from '@dovenv/utils'

import { Dovenv } from './cli'
import {
	name,
	version,
} from '../package.json'
import { updateNotifier } from './_shared/up'

const dep  = deprecatedAlerts()
const exec = async  () => {

	dep.hide()
	const up = updateNotifier( name, version )
	up.notify()
	const args   = hideBin( process.argv )
	const dovenv = new Dovenv()
	await dovenv.run(  args )

	dep.show()

}
exec()
