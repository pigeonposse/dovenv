import {
	execChild,
	catchError,
	process,
} from '@dovenv/core/utils'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type EslintConfig = { flags?: string[] }

export class Eslint extends LintSuper<EslintConfig> {

	title = CMDS.eslint
	async #fn( flags?: string[] ) {

		const setResponse = ( res: {
			stdout? : string
			stderr? : string
		} ) => {

			if ( res?.stdout ) process.stdout.write( res.stdout )
			if ( res?.stderr ) process.stderr.write( res?.stderr )

		}

		flags = this.opts?.flags ? [ ...( ( !flags || flags.length ) ? [] : flags ), ...this.opts.flags ] : flags

		const cmd = `eslint ${flags?.join( ' ' ) || ''}${flags?.includes( '--color' ) ? ' ' : ' --color'}`
		console.debug( { cmd } )
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

	async run( flags?: string[] ) {

		return await this.catchFn( this.#fn( flags ) )

	}

}
