import { setConfig } from './packages/config/eslint-config/dist/main.mjs'

const config = setConfig(
	{
		general   : 'ts',
		vue       : true,
		toml      : true,
		json      : true,
		package   : true,
		yaml      : true,
		jsdoc     : true,
		md        : true,
		gitignore : true,
		ignore    : [
			'**/docs/**/*.md',
			'**/README.md',
			'**/docs/data/**/*.md',
			'**/CHANGELOG.md',
			'**/examples/**/partials/*',
			'**/.dovenv/**/partials/*',
			'**/.dovenv/**/templates/*',
			'**/packages/create/data/**',
			'**/packages/config/**/tests/**',
		],
	},
)

export default config
