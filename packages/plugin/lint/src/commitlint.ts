
import {
	deepmergeCustom,
	LazyLoader,
} from '@dovenv/core/utils'

import {
	CMDS,
	LintSuper,
} from './_shared'

type Load = typeof import( '@commitlint/load' ).default
type UserConfig = Exclude<Parameters<Load>[0], undefined>

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

const _deps = new LazyLoader( {
	'@commitlint/format'        : async () => ( await import( '@commitlint/format' ) ).default,
	'@commitlint/lint'          : async () => ( await import( '@commitlint/lint' ) ).default,
	'@commitlint/read'          : async () => ( await import( '@commitlint/read' ) ).default,
	'@commitlint/load'          : async () => ( await import( '@commitlint/load' ) ).default,
	'commitlint-config-gitmoji' : async () => ( await import( 'commitlint-config-gitmoji' ) ).default,
} )

export class CommitLint extends LintSuper<CommitlintConfig> {

	#selectParserOpts = ( parserPreset: UserConfig['parserPreset'] ) => {

		if ( typeof parserPreset !== 'object' ) return undefined
		// @ts-ignore
		if ( typeof parserPreset.parserOpts !== 'object' ) return undefined
		// @ts-ignore
		return parserPreset.parserOpts

	}

	async #fn( userMsg?: string ) {

		const format = await _deps.get( '@commitlint/format' )
		const lint   = await _deps.get( '@commitlint/lint' )
		const load   = await _deps.get( '@commitlint/load' )
		const read   = await _deps.get( '@commitlint/read' )

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
			this.opts?.gitmoji ? await _deps.get( 'commitlint-config-gitmoji' ) : {},
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
