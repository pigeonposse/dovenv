import stylelint from 'stylelint'
// @ts-ignore
import stylelintFormatter from 'stylelint-formatter-pretty'

export type StylelintConfig = stylelint.LinterOptions
export const runStylelint = async ( conf: StylelintConfig ) => {

	const lint = await stylelint.lint( {
		...conf,
		formatter : stylelintFormatter,
	} )
	if ( lint.errored ) console.log( lint.report )
	else console.log( '✨ No errors found' )

}

