import * as dovenv from './packages/config/eslint-config/src/main.mjs'

export default [
	dovenv.includeGitIgnore(),
	...dovenv.config,
	dovenv.setIgnoreConfig( [
		'./docs/**.md',
		'**/docs/data/**/*.md',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/.dovenv/**/partials/*',
		'**/.dovenv/**/templates/*',
	] ),
	// @see https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md
]
