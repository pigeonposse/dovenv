import stylelint from 'stylelint'
// @ts-ignore
import stylelintFormatter from 'stylelint-formatter-pretty'

import {
	CMDS,
	LintSuper,
} from './_shared'

export type StylelintConfig = stylelint.LinterOptions
export const runStylelint = async ( conf: StylelintConfig ) => {

	const lint = await stylelint.lint( {
		...conf,
		formatter : stylelintFormatter,
	} )
	if ( lint.errored ) console.log( lint.report )
	else console.log( '✨ No errors found' )

}

export class StyleLint extends LintSuper<StylelintConfig> {

	title = CMDS.stylelint
	async #fn( files?: string[], fix?: boolean ) {

		this.opts = {
			...this.opts,
			...( files ? { files: files  } : {} ),
			...( fix ? { fix: true } : {} ),
		}

		this.opts =  Object.keys( this.opts ).length ? this.opts : undefined

		if ( !( await this.ensureOpts() ) ) return

		const lint = await stylelint.lint( {
			...this.opts,
			formatter : stylelintFormatter,
		} )

		if ( lint.errored ) console.log( lint.report )
		else console.log( '✨ No errors found' )

	}

	async run( files?: string[], fix?: boolean ) {

		return await this.catchFn( this.#fn( files, fix ) )

	}

}
