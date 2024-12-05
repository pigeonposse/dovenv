import format       from '@commitlint/format'
import lint         from '@commitlint/lint'
import load         from '@commitlint/load'
import read         from '@commitlint/read'
import {
	color,
	deepmergeCustom,
	promptLineProps,
} from '@dovenv/core/utils'
import gitEmojiConfig from 'commitlint-config-gitmoji'

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

export const runCommitlint = async ( conf?: CommitlintConfig, userMsg?: string  ) => {

	const defaultConfig: UserConfig = ( conf?.config )
		? conf.config
		: { rules : { 'header-max-length' : [
			0,
			'always',
			100,
		] } }

	const userConfig = merge(
		defaultConfig,
		conf?.gitmoji ? gitEmojiConfig : {},
	)

	const config = await load( userConfig )
	console.debug( 'config', config )

	const result = userMsg ? [ userMsg ] : await read( { edit: true } )
	console.debug( 'result', result )

	const cm = result[0]
	promptLineProps.log.info( `Commit message to lint: ${color.gray.dim( cm )}` )

	const report = await lint( cm, config.rules, {
		parserOpts     : selectParserOpts( config.parserPreset ),
		plugins        : config.plugins,
		ignores        : config.ignores,
		defaultIgnores : config.defaultIgnores,
	} )
	console.debug( 'report', report )

	const res = format( { results: [ report ] } )
	console.debug( 'formated response', res )

	if ( res && res !== '' ) promptLineProps.log.error( res )
	if ( report.valid ) {

		promptLineProps.log.success( '✨ Commit format is valid!' )
		promptLineProps.log.message( '' )

	}

}

