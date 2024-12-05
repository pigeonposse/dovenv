import {
	execChild,
	catchError,
	process,
} from '@dovenv/core/utils'

export type EslintConfig = { flags?: string[] }
export const runEslint = async ( conf?: EslintConfig ) => {

	const setResponse = ( res: {
		stdout? : string
		stderr? : string
	} ) => {

		if ( res?.stdout ) process.stdout.write( res.stdout )
		if ( res?.stderr ) process.stderr.write( res?.stderr )

	}
	const cmd         = `eslint ${conf?.flags?.join( ' ' ) || ''}${conf?.flags?.includes( '--color' ) ? ' ' : ' --color'}`
	// await exec( cmd )
	const [ error, res ] = await catchError( execChild( cmd ) )
	const stderr         = res?.stderr && res?.stderr.trim() === '' ? undefined : res?.stderr
	const stdout         = res?.stdout && res?.stdout.trim() === '' ? undefined : res?.stdout

	console.debug( {
		error,
		stderr,
		stdout,
	} )

	if ( error ) {

		if ( typeof error === 'object' && 'stdout' in  error && 'stderr' in error ) setResponse( {
			stdout : error.stdout as string,
			stderr : error.stderr as string,
		} )
		else
			console.error( 'Unexpected error running eslint', error?.message || error )
		return

	}
	else setResponse( res )

}
