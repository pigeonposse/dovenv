import {
	exec,
	process,
} from '@dovenv/utils'
import lintStaged from 'lint-staged'
import stylelint  from 'stylelint'

export const runEslint = async () => {

	const cmd = `eslint ${process.argv.slice( 3 ).join( ' ' )}`

	await exec( cmd )

}
export const runStylelint = async ( conf: stylelint.LinterOptions ) => {

	const lint = await stylelint.lint( conf )
	console.log( lint )

}

export const runLintStaged = async ( conf?: Record<string, string> ) => {

	if ( conf?.staged )
		await lintStaged( { config: conf.staged } )
	else throw new Error( 'No staged files provided' )

}
