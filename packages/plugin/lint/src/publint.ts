import { resolvePath } from '@dovenv/core/utils'
import {
	Options,
	publint,
} from 'publint'
import { formatMessage } from 'publint/utils'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type PubLintOpts = Options & { title?: string }
export type PubLintConfig = Record<string, PubLintOpts>

export class PubLint extends LintSuper<PubLintConfig> {

	async #exec( opts?: PubLintOpts ) {

		const {
			messages, pkg,
		} = await publint( opts )
		const pkgDir = opts?.pkgDir ? resolvePath( opts?.pkgDir ) : this.utils.process.cwd()
		this.utils.prompt.log.info( this.utils.style.info.badge( opts?.title || 'lint' ) + ' ' + this.utils.style.info.p( pkgDir ) )
		for ( const message of messages ) {

			const msg = formatMessage( message, pkg ) || 'No output message'

			if ( message.type === 'error' ) this.utils.prompt.log.errorWithExit( msg )
			if ( message.type === 'warning' ) this.utils.prompt.log.warn( msg )
			else this.utils.prompt.log.message( this.utils.style.warn.h( 'recommendation:\n' ) + msg )

		}

		this.utils.prompt.log.success( this.utils.style.success.h( 'Succefully linted!\n' ) )

	}

	async #fn( keys?: string[] ) {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) || !this.opts ) return

		console.debug( { publintConf: this.opts } )
		const userKey = await this.utils.getOptsKeys( {
			input   : this.opts,
			pattern : typeof keys === 'string' ? [ keys ] : keys,
		} )
		if ( !userKey ) return
		for ( const key of userKey ) {

			await this.#exec( {
				...this.opts[key],
				title : this.opts[key].title || key,
			} )

		}

	}

	async runOne( opts?: PubLintOpts ) {

		// this.transformHelpInfo( CMDS.publint )
		// return await this.utils.catchFn( this.#exec( opts ) )
		await this.#exec( opts )

	}

	async run( keys?: string[] ) {

		this.transformHelpInfo( CMDS.publint )
		await this.#fn( keys )

	}

}
