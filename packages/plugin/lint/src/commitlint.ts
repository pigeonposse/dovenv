import format              from '@commitlint/format'
import lint                from '@commitlint/lint'
import load                from '@commitlint/load'
import read                from '@commitlint/read'
import { PluginCore }      from '@dovenv/core'
import { deepmergeCustom } from '@dovenv/core/utils'
import gitEmojiConfig      from 'commitlint-config-gitmoji'

import type { Config as DoveEnvConfig } from '@dovenv/core'

type UserConfig = Exclude<Parameters<typeof load>[0], undefined>
const merge = deepmergeCustom<UserConfig>( { mergeArrays: false } )

export type CommitlintConfig = {
	/**
	 * User config for commitlint
	 * @see https://commitlint.js.org/reference/rules-configuration.html
	 */
	config?  : UserConfig
	/**
	 * Enable gitmoji Config to commitlint
	 * this activates the `gitmoji` plugin
	 * @see https://www.npmjs.com/package/commitlint-config-gitmoji
	 * @default false
	 */
	gitmoji? : boolean
}

const selectParserOpts = ( parserPreset: UserConfig['parserPreset'] ) => {

	if ( typeof parserPreset !== 'object' ) return undefined
	// @ts-ignore
	if ( typeof parserPreset.parserOpts !== 'object' ) return undefined
	// @ts-ignore
	return parserPreset.parserOpts

}
export class CommitLint extends PluginCore {

	opts
	config

	constructor( opts?: CommitlintConfig, config?: DoveEnvConfig ) {

		super()
		this.opts   = opts || {}
		this.config = config

	}

	async run( userMsg?: string ) {

		const defaultConfig: UserConfig = ( this.opts?.config )
			? this.opts?.config
			: { rules : { 'header-max-length' : [
				0,
				'always',
				100,
			] } }

		const userConfig = merge(
			defaultConfig,
			this.opts?.gitmoji ? gitEmojiConfig : {},
		)

		const config = await load( userConfig )
		console.debug( 'config', config )

		const result = userMsg ? [ userMsg ] : await read( { edit: true } )
		console.debug( 'result', result )

		const cm = result[0]
		this.prompt.log.info( `Commit message to lint: ${this.style.get.text( cm )}` )

		const report = await lint( cm, config.rules, {
			parserOpts     : selectParserOpts( config.parserPreset ),
			plugins        : config.plugins,
			ignores        : config.ignores,
			defaultIgnores : config.defaultIgnores,
		} )

		console.debug( 'report', report )

		const res = format( { results: [ report ] } )

		console.debug( 'formated response', res )

		if ( res && res !== '' ) this.prompt.log.error( res )
		if ( report.valid ) {

			this.prompt.log.success(  this.style.get.succed( 'Commit format is valid!' ) )
			this.prompt.log.message( '' )

		}

	}

}
