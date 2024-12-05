
// @ts-ignore
import lintStaged from 'lint-staged'

export type LintStagedConfig = Record<string, string>
export const runLintStaged = async ( conf?: LintStagedConfig ) => {

	console.debug( { lintStagedConf: conf } )
	if ( conf ) await lintStaged( { config: conf } )
	else throw new Error( 'No staged files provided' )

}
