import * as dovenv from './packages/config/eslint-config/dist/main.mjs'

const ignore = dovenv.setIgnoreConfig( [
	'**/docs/**/*.md',
	'**/README.md',
	'**/docs/data/**/*.md',
	'**/CHANGELOG.md',
	'**/examples/**/partials/*',
	'**/.dovenv/**/partials/*',
	'**/.dovenv/**/templates/*',
	'**/packages/create/data/**',
	'**/packages/config/**/tests/**',
] )

export default [
	dovenv.includeGitIgnore( ),
	...dovenv.config,
	ignore,
]

