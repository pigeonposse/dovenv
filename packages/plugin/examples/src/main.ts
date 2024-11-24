import type { Config as DoveEnvConfig } from '@dovenv/core'

type Config = boolean

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { examples : {
		desc : 'Toolkit for our examples paths',
		fn   : async (  ) => {

			console.log( '[coming soon]' )
			console.debug( conf )

		},
	} } }

}
