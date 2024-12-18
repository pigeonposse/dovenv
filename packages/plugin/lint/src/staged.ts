
// @ts-ignore
import lintStaged from 'lint-staged'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type LintStagedConfig = Record<string, string>

export class StagedLint extends LintSuper<LintStagedConfig> {

	title = CMDS.staged
	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		console.debug( { lintStagedConf: this.opts } )
		await lintStaged( { config: this.opts } )

	}

	async run( ) {

		return await this.catchFn( this.#fn( ) )

	}

}
