import stylelint from 'stylelint'
// @ts-ignore
import stylelintFormatter from 'stylelint-formatter-pretty'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type StylelintConfig = stylelint.LinterOptions

export class StyleLint extends LintSuper<StylelintConfig> {

	async #fn( files?: string[], fix?: boolean ) {

		this.opts = {
			...this.opts,
			...( files ? { files: files } : {} ),
			...( fix ? { fix: true } : {} ),
		}

		this.opts =  Object.keys( this.opts ).length ? this.opts : undefined

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		const lint = await stylelint.lint( {
			...this.opts,
			formatter : stylelintFormatter,
		} )

		if ( lint.errored ) console.error( lint.report )
		else console.log( '✨ No errors found' )

	}

	async run( files?: string[], fix?: boolean ) {

		this.transformHelpInfo( CMDS.stylelint )
		return await this.utils.catchFn( this.#fn( files, fix ) )

	}

}
