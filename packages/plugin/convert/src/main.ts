import type { Config as DoveEnvConfig } from 'dovenv'

type Config = boolean

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { convert : {
		desc : 'Convert files from one format to another [coming soon]',
		fn   : async (  ) => {

			console.log( '[coming soon]' )
			console.debug( conf )

		},
	} } }

}

