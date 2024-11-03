
export default {
	env : {
		browser  : true,
		node     : true,
		commonjs : true,
		es2022   : true,
		jquery   : true,
	},
	extends : [
		'eslint:recommended',
		'plugin:promise/recommended',
		'plugin:jsdoc/recommended',
		'plugin:import/recommended',
	],
	plugins : [
		'html',
		'align-import',
		'align-assignments',
		'promise',
		'jsonc',
		'yaml',
		'canonical',
	],
	parserOptions : {
		ecmaVersion                 : 2023,
		sourceType                  : 'module',
		allowImportExportEverywhere : true,
	},
	rules : {
		// ALIGN IMPORTS
		'align-import/align-import'           : 'error',
		'align-import/trim-import'            : 'error',
		'align-assignments/align-assignments' : [ 'error', { requiresOnly: false } ],
		'canonical/import-specifier-newline'  : 'error',
		'canonical/export-specifier-newline'  : 'error',

		// CODING STYLES
		'camelcase'   : 'warn',
		'key-spacing' : [
			'error',
			{
				multiLine : {
					beforeColon : true,
					afterColon  : true,
				},
				align : {
					beforeColon : true,
					afterColon  : true,
					on          : 'colon',
				},
			},
		],
		'switch-colon-spacing' : [
			'error',
			{
				after  : true,
				before : true,
			},
		],
		'comma-dangle'            : [ 'error', 'always-multiline' ],
		'comma-spacing'           : [ 'error', { after: true } ],
		'no-multiple-empty-lines' : [
			'error',
			{
				max    : 1,
				maxEOF : 1,
				maxBOF : 1,
			},
		],
		'padded-blocks' : [ 'error', 'always' ],
		'one-var'       : [
			'error',
			{
				var   : 'always',
				let   : 'always',
				const : 'never',
			},
		],
		'vars-on-top'           : 'warn',
		'space-in-parens'       : [ 'error', 'always' ],
		'object-curly-spacing'  : [ 'error', 'always' ],
		'array-bracket-spacing' : [ 'error', 'always' ],
		'indent'                : [ 'error', 'tab' ],
		'linebreak-style'       : [ 'error', 'unix' ],
		'semi'                  : [ 'error', 'never' ],
		'operator-linebreak'    : [ 'error', 'before' ],
		'arrow-parens'          : [ 'error', 'as-needed' ],
		'default-case-last'     : 'error',
		'default-case'          : 'error',
		'eol-last'              : [ 'error', 'always' ],
		'no-prototype-builtins' : 'off',
		'no-inline-comments'    : 'off',
		'space-infix-ops'       : 'error',
		'no-multi-spaces'       : [
			'error',
			{ exceptions : {
				ImportDeclaration    : true,
				VariableDeclarator   : { allow: 1 },
				AssignmentExpression : true,
			} },
		],

		// IMPORTS
		'import/newline-after-import' : 'error',
		'import/order'                : [
			'error',
			{
				'groups' : [
					[ 'builtin', 'external' ],
					[
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
					],
					[ 'type' ],
				],
				'alphabetize' : {
					order           : 'asc',
					caseInsensitive : true,
				},
				'newlines-between'        : 'always',
				'warnOnUnassignedImports' : true,
			},
		],
	},
	ignorePatterns : [
		// Ignored files and folders
		'vendor/',
		'**/vendor/*',
		'**/node_modules/*',
		'dist/*',
		'**/build/*',
		'static/',
		'public/',
		'packages/_config/*',
		'**/__temp__/*',
		'**/__cache__/*',
		'docs/partials/**',
		'docs/index.md',
	],
	overrides : [
		{
			// JS & TS Specific Configuration
			files : [
				'**/*.js',
				'**/*.mjs',
				'**/*.cjs',
				'**/*.jsx',
				'**/*.ts',
				'**/*.mts',
				'**/*.cts',
				'**/*.tsx',
			],
			rules : { quotes: [ 'error', 'single' ] },
		},
		{
			// CommonJS specific environment
			files : [ '**/*.cjs' ],
			env   : { node: true },
		},
		{
			// JSDoc Configuration
			files : [ '**/*.js', '**/*.ts' ],
			rules : {
				'jsdoc/sort-tags'                               : 'error',
				'jsdoc/require-jsdoc'                           : [ 'error', { require: {} } ],
				'jsdoc/require-description'                     : [ 'error', { descriptionStyle: 'body' } ],
				'jsdoc/require-hyphen-before-param-description' : [ 'error', 'always' ],
				'jsdoc/check-indentation'                       : 'error',
				'jsdoc/check-line-alignment'                    : [ 'error', 'always' ],
				'jsdoc/require-description-complete-sentence'   : [ 'error' ],
				'jsdoc/require-example'                         : 'error',
			},
		},
		{
			// TypeScript Configuration
			files   : [ '**/*.ts' ],
			plugins : [ '@typescript-eslint' ],
			extends : [ 'plugin:@typescript-eslint/recommended' ],
			parser  : '@typescript-eslint/parser',
			rules   : {
				'@typescript-eslint/consistent-type-imports' : [ 'error', { prefer: 'type-imports' } ],
				'@typescript-eslint/no-unused-vars'          : [
					'error',
					{
						args               : 'all',
						argsIgnorePattern  : '^_',
						ignoreRestSiblings : true,
					},
				],
			},
		},
		{
			// YAML Configuration
			files   : [ '**/*.yaml', '**/*.yml' ],
			extends : [ 'plugin:yaml/recommended' ],
		},
		{
			// Markdown Configuration
			files   : [ '**/*.md' ],
			extends : [ 'plugin:markdownlint/recommended' ],
			parser  : 'eslint-plugin-markdownlint/parser',
			rules   : {
				'markdownlint/md013' : 'off', // line length
				'markdownlint/md033' : 'off', // inline HTML
			},
		},
		{
			// JSON Configuration
			files : [
				'**/*.json',
				'**/*.json5',
				'**/*.jsonc',
			],
			parser : 'jsonc-eslint-parser',
			rules  : {
				'jsonc/indent'                : [ 'error', 'tab' ],
				'jsonc/array-bracket-newline' : [ 'error', 'always' ],
				'jsonc/quotes'                : [ 'error', 'double' ],
			},
		},
	],
}
