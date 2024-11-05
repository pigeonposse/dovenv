import format              from '@commitlint/format'
import lint                from '@commitlint/lint'
import load                from '@commitlint/load'
import read                from '@commitlint/read'
import { deepmergeCustom } from '@dovenv/utils'
import gitEmojiConfig      from 'commitlint-config-gitmoji'

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

export const runCommitlint = async ( conf?: CommitlintConfig ) => {

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

	const result = await read( { edit: true } )
	console.debug( 'result', result )

	const report = await lint( result[0], config.rules, {
		parserOpts     : selectParserOpts( config.parserPreset ),
		plugins        : config.plugins,
		ignores        : config.ignores,
		defaultIgnores : config.defaultIgnores,
	} )
	console.debug( 'report', report )

	if ( !report.valid ) {

		const res = format( { results: [ report ] } )
		console.log( res )

	}
	else console.log( '✨ Commit format is valid!' )

}

