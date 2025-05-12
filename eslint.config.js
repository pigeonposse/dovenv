import * as dovenv from './packages/config/eslint-config/dist/main.mjs'

const config = dovenv.setConfig(
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
	// c => ([
	// 	...c,
	// 	{
	// 		rules: {
	// 			'@stylistic/object-curly-newline'    : [ 'error', { minProperties: 2, TSPropertySignature: {minProperties: 1} } ]
	// 		},
	// 	}
	// ])
)

export default config
