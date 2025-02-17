import * as dovenvEslintConfig from '@dovenv/eslint-config'
// @ts-ignore
import * as dovenvStylelintConfig from '@dovenv/stylelint-config'

import {
	CMDS,
	LintSuper,
} from './_shared'
import { CommitLint } from './commitlint'
import { Eslint }     from './eslint'
import { StagedLint } from './staged'
import { StyleLint }  from './style'

import type { CommitlintConfig }        from './commitlint'
import type { EslintConfig }            from './eslint'
import type { LintStagedConfig }        from './staged'
import type { StylelintConfig }         from './style'
import type { Config as  DovenvConfig } from '@dovenv/core'

export {
	CommitLint,
	Eslint,
	StagedLint,
	StyleLint,
	dovenvEslintConfig,
	dovenvStylelintConfig,
}

export type Config = {
	/** Config for lint staged GIT files */
	[CMDS.staged]?     : LintStagedConfig
	/** Config for lint CSS/SCSS/LESS/SASS/PostCSS files */
	[CMDS.stylelint]?  : StylelintConfig
	/** Config for lint JS/TS/MD/JSON/YAML.. files */
	[CMDS.eslint]?     : EslintConfig
	/** Config for lint commit messages */
	[CMDS.commitlint]? : CommitlintConfig
	[CMDS.custom]?: {
		[key in string]: ( data: {
			run    : {
				[CMDS.eslint]     : ( opts?: Eslint['opts'] ) => ReturnType<Eslint['run']>
				[CMDS.commitlint] : ( opts?: CommitLint['opts'] ) => ReturnType<CommitLint['run']>
				[CMDS.stylelint]  : ( opts?: StyleLint['opts'] ) => ReturnType<StyleLint['run']>
				[CMDS.staged]     : ( opts?: StagedLint['opts'] ) => ReturnType<StagedLint['run']>
			}
			config : DovenvConfig
		} ) => Promise<unknown>
	}
}

/**
 * Lint class with all lint functions
 */
export class Lint extends LintSuper<Config> {

	#eslintInstance( o: Config['eslint'] ) {

		return new Eslint(  o, this.utils )

	}

	#commitlintInstance( o: Config['commitlint'] ) {

		return new CommitLint(  o, this.utils )

	}

	#stylelintInstance( o: Config['stylelint'] ) {

		return new StyleLint(  o, this.utils )

	}

	#stagedInstamce( o: Config['staged'] ) {

		return new StagedLint( o, this.utils )

	}

	async eslint( flags: string[] ) {

		const ins = this.#eslintInstance(  this.opts?.eslint )
		return await ins.run( flags )

	}

	async commitlint( userMsg?: string ) {

		const ins = this.#commitlintInstance(  this.opts?.commitlint )
		await ins.run( userMsg )

	}

	async stylelint( files?: string[], fix?: boolean ) {

		const ins = this.#stylelintInstance(  this.opts?.stylelint )
		await ins.run( files, fix )

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
				config : this.utils.config || {},
				run    : {
					[CMDS.eslint]     : async ( opts?: Eslint['opts'] ) => await this.#eslintInstance( opts ).run(),
					[CMDS.commitlint] : async ( opts?: CommitLint['opts'] ) => await this.#commitlintInstance( opts ).run(),
					[CMDS.stylelint]  : async ( opts?: StyleLint['opts'] ) => await this.#stylelintInstance( opts ).run(),
					[CMDS.staged]     : async ( opts?: StagedLint['opts'] ) => await this.#stagedInstamce( opts ).run(),
				},
			} )

		}

	}

	async custom( pattern?: string[] ) {

		return await this.utils.catchFn( this.#custom( pattern ) )

	}

}
