import { defineConfig } from 'dovenv'

export const config = () => {

	return defineConfig( { custom : { convert : {
		desc : 'Convert files from one format to another [coming soon]',
		fn   : async (  ) => {

			console.log( '[coming soon] Convert files from one format to another' )

		},
	} } } )

}
