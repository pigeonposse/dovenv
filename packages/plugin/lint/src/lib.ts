
import {
	CMDS,
	LintSuper,
} from './_shared'
import { CommitLint } from './commitlint'
import { Eslint }     from './eslint'
import { PubLint }    from './publint'
import { StagedLint } from './staged'
import { StyleLint }  from './stylelint'

import type { CommitlintConfig } from './commitlint'
import type { EslintConfig }     from './eslint'
import type { PubLintConfig }    from './publint'
import type { LintStagedConfig } from './staged'
import type { StylelintConfig }  from './stylelint'

export {
	CommitLint,
	Eslint,
	StagedLint,
	PubLint,
	StyleLint,
}

export type Config = {
	/** Config for lint staged GIT files */
	[CMDS.staged]?     : LintStagedConfig
	/** Config for lint CSS/SCSS/LESS/SASS/PostCSS files */
	[CMDS.stylelint]?  : StylelintConfig
	/** Config for lint JS/TS/MD/JSON/YAML.. Files */
	[CMDS.eslint]?     : EslintConfig
	/** Config for lint commit messages */
	[CMDS.commitlint]? : CommitlintConfig
	/** Config for publint */
	[CMDS.publint]?    : PubLintConfig
	/** Custom lint */
	[CMDS.custom]?: {
		[key in string]: ( data: {
			run    : {
				[CMDS.eslint]     : ( opts?: Eslint['opts'] ) => ReturnType<Eslint['run']>
				[CMDS.commitlint] : ( opts?: CommitLint['opts'] ) => ReturnType<CommitLint['run']>
				[CMDS.stylelint]  : ( opts?: StyleLint['opts'] ) => ReturnType<StyleLint['run']>
				[CMDS.staged]     : ( opts?: StagedLint['opts'] ) => ReturnType<StagedLint['run']>
				[CMDS.publint]    : ( opts?: NonNullable<PubLint['opts']>[keyof PubLint['opts']] ) => ReturnType<PubLint['runOne']>
			}
			utils : LintSuper['utils']
		} ) => Promise<unknown>
	}
}

/**
 * Lint class with all lint functions.
 */
export class Lint extends LintSuper<Config> {

	#eslintInstance( o: Config['eslint'] ) {

		return new Eslint( o, this.utils )

	}

	#commitlintInstance( o: Config['commitlint'] ) {

		return new CommitLint( o, this.utils )

	}

	#stylelintInstance( o: Config['stylelint'] ) {

		return new StyleLint( o, this.utils )

	}

	#stagedInstamce( o: Config['staged'] ) {

		return new StagedLint( o, this.utils )

	}

	#publintInstance( o: Config['publint'] ) {

		return new PubLint( o, this.utils )

	}

	async eslint( flags: string[] ) {

		const ins = this.#eslintInstance( this.opts?.eslint )
		return await ins.run( flags )

	}

	async commitlint( userMsg?: string ) {

		const ins = this.#commitlintInstance( this.opts?.commitlint )
		await ins.run( userMsg )

	}

	async stylelint( files?: string[], fix?: boolean ) {

		const ins = this.#stylelintInstance( this.opts?.stylelint )
		await ins.run( files, fix )

	}

	async publint( keys?: string[] ) {

		const ins = this.#publintInstance( this.opts?.publint )
		await ins.run( keys )

	}

	async staged() {

		const ins = this.#stagedInstamce( this.opts?.staged )
		await ins.run()

	}

	async #custom( pattern?: string[] ) {

		const opts = this.opts?.custom

		const keys = await this.utils.getOptsKeys( {
			input : opts,
			pattern,
			name  : this.utils.title + '.custom',
		} )
		if ( !keys || !opts ) return

		for ( const key of keys ) {

			console.log( this.utils.style.info.h( `Custom lint for ${this.utils.style.badge( key )} key` ) )

			const opt = opts[key]
			await opt( {
				utils : this.utils,
				run   : {
					[CMDS.publint] : async opts =>
						await this.#publintInstance( { } ).runOne( opts ),
					[CMDS.eslint] : async opts =>
						await this.#eslintInstance( opts ).run(),
					[CMDS.commitlint] : async opts =>
						await this.#commitlintInstance( opts ).run(),
					[CMDS.stylelint] : async opts =>
						await this.#stylelintInstance( opts ).run(),
					[CMDS.staged] : async opts =>
						await this.#stagedInstamce( opts ).run(),
				},
			} )

		}

	}

	async custom( pattern?: string[] ) {

		await this.#custom( pattern )
		// return await this.utils.catchFn( this.#custom( pattern ) )

	}

}
