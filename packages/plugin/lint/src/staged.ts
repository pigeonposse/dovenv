import lintStaged from 'lint-staged'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type LintStagedConfig = Record<string, string>

export class StagedLint extends LintSuper<LintStagedConfig> {

	async #fn() {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		console.debug( { lintStagedConf: this.opts } )
		const res = await lintStaged( {
			config : this.opts,
			shell  : true,
		} )
		if ( !res ) throw Error( 'Unsuccessful response 😢' )

	}

	async run( ) {

		this.transformHelpInfo( CMDS.staged )
		return await this.utils.catchFn( this.#fn( ) )

	}

}
