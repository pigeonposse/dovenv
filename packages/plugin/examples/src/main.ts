import type { Config as DoveEnvConfig } from 'dovenv'

type Config = boolean

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { examples : {
		desc : 'Toolkit for examples files/directories',
		fn   : async (  ) => {

			console.log( '[coming soon]' )
			console.debug( conf )

		},
	} } }

}
