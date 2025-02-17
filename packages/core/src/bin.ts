import {
	process,
	hideBin,
	performance,
} from '@dovenv/utils'

import {
	PKG_NAME,
	VERSION,
} from './_shared/const'
import { updateNotifier } from './_shared/up'
import { Dovenv }         from './cli'

const exec = async  () => {

	const startTime = performance()
	const up        = updateNotifier( PKG_NAME, VERSION )
	up.notify()

	const args   = hideBin( process.argv )
	const dovenv = new Dovenv()
	await dovenv.run(  args )

	console.debug( `⏱ Dovenv's initiation took place over a period of time of: ${startTime.prettyStop()}` )

}
exec()
