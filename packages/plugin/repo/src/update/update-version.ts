import {
	execProcess,
	exec,
} from '@dovenv/utils'

export const updatePakageVersion = async ( ) => {

	await execProcess( {
		name : 'UPDATE',
		on   : async ( ) => {

			await exec( 'changeset && changeset version' )

		},

	} )

}
