import {
	execChild,
	catchError,
} from '@dovenv/core/utils'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type EslintConfig = { flags?: string[] }

export class Eslint extends LintSuper<EslintConfig> {

	async #fn( flags?: string[] ) {

		const setResponse = ( res: {
			stdout? : string
			stderr? : string
		} ) => {

			const {
				process, style,
			} = this.utils
			if ( res?.stdout ) process.stdout.write( res.stdout )
			if ( res?.stderr ) process.stderr.write( res?.stderr )
			if ( res?.stdout?.trim() === '' && res?.stderr?.trim() === '' )
				this.utils.prompt.log.success( style.success.h( 'Succesfully linted!\n' ) )

		}

		const flagsSet = new Set( [
			...( flags || [] ),
			...( this.opts?.flags || [] ),
			'--color',
		] )

		const cmd = [ 'eslint', ...[ ...flagsSet ] ].join( ' ' )
		console.debug( {
			extraFlags : flags,
			cmd,
		} )

		this.utils.prompt.log.info( this.utils.style.info.msg( 'ESLINT', `Exec: ${cmd}\n\n` ) )
		const [ error, res ] = await catchError( execChild( cmd ) )
		const stderr         = res?.stderr && res?.stderr.trim() === '' ? undefined : res?.stderr
		const stdout         = res?.stdout && res?.stdout.trim() === '' ? undefined : res?.stdout

		console.debug( {
			error,
			stderr,
			stdout,
		} )

		if ( error ) {

			if ( typeof error === 'object' && 'stdout' in error && 'stderr' in error ) setResponse( {
				stdout : error.stdout as string,
				stderr : error.stderr as string,
			} )
			else console.error( 'Unexpected error running eslint', error?.message || error )
			this.utils.exitWithError()

		}
		else setResponse( res )

	}

	async run( flags?: string[] ) {

		this.transformHelpInfo( CMDS.eslint )
		return await this.utils.catchFn( this.#fn( flags ) )

	}

}
