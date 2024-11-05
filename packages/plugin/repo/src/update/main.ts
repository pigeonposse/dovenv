import { UpdateVersion } from './update-version'

import type { Config as DoveEnvConfig } from 'dovenv'

type Config = boolean

export const config = ( opts?: Config ): DoveEnvConfig => {

	const res: DoveEnvConfig['custom'] = { 'update-version' : {
		desc : 'Git commands',
		fn   : async ( ) => {

			const update = new UpdateVersion()
			await update.run()

		},
	} }
	return { custom: res }

}
