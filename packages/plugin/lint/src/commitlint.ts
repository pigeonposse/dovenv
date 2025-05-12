import format              from '@commitlint/format'
import lint                from '@commitlint/lint'
import load                from '@commitlint/load'
import read                from '@commitlint/read'
import { deepmergeCustom } from '@dovenv/core/utils'
import gitEmojiConfig      from 'commitlint-config-gitmoji'

import {
	CMDS,
	LintSuper,
} from './_shared'

type UserConfig = Exclude<Parameters<typeof load>[0], undefined>

export type CommitlintConfig = {
	/**
	 * User config for commitlint.
	 *
	 * @see https://commitlint.js.org/reference/rules-configuration.html
	 */
	config?  : UserConfig
	/**
	 * Enable gitmoji Config to commitlint
	 * this activates the `gitmoji` plugin.
	 *
	 * @default false
	 * @see https://www.npmjs.com/package/commitlint-config-gitmoji
	 */
	gitmoji? : boolean
}

export class CommitLint extends LintSuper<CommitlintConfig> {

	#selectParserOpts = ( parserPreset: UserConfig['parserPreset'] ) => {

		if ( typeof parserPreset !== 'object' ) return undefined
		// @ts-ignore
		if ( typeof parserPreset.parserOpts !== 'object' ) return undefined
		// @ts-ignore
		return parserPreset.parserOpts

	}

	async #fn( userMsg?: string ) {

		const defaultConfig: UserConfig = ( this.opts?.config )
			? this.opts?.config
			: { rules : { 'header-max-length' : [
				0,
				'always',
				100,
			] } }

		const merge      = deepmergeCustom<UserConfig>( { mergeArrays: false } )
		const userConfig = merge(
			defaultConfig,
			this.opts?.gitmoji ? gitEmojiConfig : {},
		)

		const config = await load( userConfig )
		console.debug( 'config', config )

		const result = userMsg ? [ userMsg ] : await read( { edit: true } )
		console.debug( 'result', result )

		const cm = result[0]
		this.utils.prompt.log.info( this.utils.style.info.msg( `Commit message to lint`, cm ) )

		const report = await lint( cm, config.rules, {
			parserOpts     : this.#selectParserOpts( config.parserPreset ),
			plugins        : config.plugins,
			ignores        : config.ignores,
			defaultIgnores : config.defaultIgnores,
		} )

		console.debug( 'report', report )

		const res = format( { results: [ report ] } )

		console.debug( 'formated response', res )

		if ( res && res !== '' ) this.utils.prompt.log.errorWithExit( res )
		if ( report.valid ) {

			this.utils.prompt.log.success( this.utils.style.success.h( 'Commit format is valid!' ) )
			this.utils.prompt.log.message( '' )

		}

	}

	async run( userMsg?: string ) {

		this.transformHelpInfo( CMDS.commitlint )
		return await this.utils.catchFn( this.#fn( userMsg ) )

	}

}
