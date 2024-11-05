
// @ts-ignore
import lintStaged from 'lint-staged'

export type LintStagedConfig = Record<string, string>
export const runLintStaged = async ( conf?: LintStagedConfig ) => {

	if ( conf?.staged ) await lintStaged( { config: conf.staged } )
	else throw new Error( 'No staged files provided' )

}
