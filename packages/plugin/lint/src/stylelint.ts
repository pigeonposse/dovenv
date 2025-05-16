
import { LazyLoader } from '@dovenv/core/utils'

import {
	CMDS,
	LintSuper,
} from './_shared'

import type stylelint from 'stylelint'

export type StylelintConfig = stylelint.LinterOptions
type Formatter = keyof typeof stylelint.formatters

const _deps = new LazyLoader( {
	stylelint : async () => ( await import( 'stylelint' ) ).default,
	// @ts-ignore
	formatter : async () => ( await import( 'stylelintFormatter' ) ).default as Formatter,
} )

export class StyleLint extends LintSuper<StylelintConfig> {

	async #fn( files?: string[], fix?: boolean ) {

		this.opts = {
			...this.opts,
			...( files ? { files: files } : {} ),
			...( fix ? { fix: true } : {} ),
		}

		this.opts =  Object.keys( this.opts ).length ? this.opts : undefined

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return
		const stylelint = await _deps.get( 'stylelint' )
		const formatter = await _deps.get( 'formatter' )
		const lint      = await stylelint.lint( {
			...this.opts,
			formatter,
		} )

		if ( lint.errored ) console.error( lint.report )
		else console.log( '✨ No errors found' )

	}

	async run( files?: string[], fix?: boolean ) {

		this.transformHelpInfo( CMDS.stylelint )
		return await this.utils.catchFn( this.#fn( files, fix ) )

	}

}
