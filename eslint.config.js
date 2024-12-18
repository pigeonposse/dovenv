import * as dovenv from './packages/config/eslint-config/src/main.mjs'

// console.dir( dovenv.generalConfig, { depth: 4 } )
export default [
	dovenv.includeGitIgnore(),
	...dovenv.config,
	dovenv.setIgnoreConfig( [
		'./docs/**/*',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/examples/**/templates/*',
	] ),
	// @see https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md
]
