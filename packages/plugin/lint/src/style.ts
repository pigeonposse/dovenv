
import stylelint from 'stylelint'

export type StylelintConfig = stylelint.LinterOptions
export const runStylelint = async ( conf: StylelintConfig ) => {

	const lint = await stylelint.lint( conf )
	console.log( lint )

}

