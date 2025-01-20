import { type Config as BandaConfig } from '@dovenv/theme-banda'

export const wsGeneralTemplates = {
	gitignore : `# #############################################################################
# .gitignore config.
# #############################################################################
#
# @description Specifies which files and directories should be ignored by Git, 
#              ensuring a clean version control history.
# @see https://git-scm.com/docs/gitignore
#
# #############################################################################

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

.pnpm-store
node_modules
/build
**/dist
dist
dist-ssr
**/vendor
/vendor
packages/**/build
*.local

# misc
.DS_Store

# Editor directories and files
# .vscode/*
# !.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Tuborepo
/.turbo
**/.turbo

# Parcel
/.parcel-cache
**/.parcel-cache

# Svelte
/.svelte-kit
**/.svelte-kit

# playwright 
/test-results
**/test-results

# project 
**/__temp__
/__cache__
**/__cache__
**/*.timestamp-*
**/__temp__/*
**/__cache__/*
docs/dev-dist
**/docs/dev-dist
**/.wrangler/**
`,
	eslintConfig : `import * as dovenv from '@dovenv/theme-pigeonposse'

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
]
`,
	editorconfig : `# #############################################################################
# EditorConfig config.
# #############################################################################
#
# @description Used to maintain consistent code formatting across different code editors and IDEs in a software project.
# @see https://EditorConfig.org
#
# #############################################################################

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
indent_style = tab
indent_size = 4

# Matches multiple files with brace expansion notation
# Set default charset
[*.{js,cjs,mjs,ts,html,svelte}]
charset = utf-8
`,
	npmrc : `# #############################################################################
# .npmrc config.
# #############################################################################
#
# @description Configuration file used for npm (Node Package Manager) to set various npm options.
# @see https://docs.npmjs.com/files/npmrc
#
# #############################################################################

registry=https://registry.npmjs.org/`,
	changeset : `{
	"$schema": "https://unpkg.com/@changesets/config/schema.json",
	"commit": false,
	"fixed": [
	],
	"linked": [
	],
	"access": "restricted",
	"baseBranch": "main",
	"updateInternalDependencies": "patch",
	"privatePackages": {
		"version": true,
		"tag": true
	},
	"ignore": [
	]
}
`,
	vscodeSettings : `/**
 * *****************************************************************************
 * vscode config.
 * *****************************************************************************
 * @description Configuration file for Visual Studio Code (VSCode) settings specific to your project.
 * @see https://code.visualstudio.com/docs/getstarted/settings
 *
 * *****************************************************************************
 */
{
	"files.autoSave": "onFocusChange",
	"editor.codeActionsOnSave": {
		"source.fixAll": "explicit",
		"source.fixAll.eslint": "explicit",
		"source.fixAll.stylelint": "explicit"
	},
	"eslint.useFlatConfig": true,
	"stylelint.validate": [
		"css",
		"scss",
		"less",
		"html",
		"vue",
		"svelte",
		"astro",
	],
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"markdown",
		"json",
		"jsonc",
		"json5",
		"yaml",
		"toml",
		"html",
		"css",
		"scss",
		"less",
		"svelte",
		"vue"
	],
	"javascript.updateImportsOnFileMove.enabled": "always",
	"[markdown]": {
		"editor.formatOnSave": true,
		"editor.formatOnPaste": true
	},
	"markdownlint.ignore": [
		"**/LICENSE",
		"docs/partials/**",
		"docs/index",
		"docs/post/**"
	],
	"terminal.integrated.defaultProfile.linux": "zsh",
	"terminal.integrated.profiles.linux": {
		"zsh": {
			"path": "/bin/zsh"
		},
	},
	"editor.tabSize": 4,
	"typescript.tsdk": "node_modules/typescript/lib"
}
`,
	vscodeExtensions : `{
	"recommendations": [
		"davidanson.vscode-markdownlint",
		"gruntfuggly.todo-tree",
		"shd101wyy.markdown-preview-enhanced",
		"ms-playwright.playwright",
		"dbaeumer.vscode-eslint",
		"christian-kohler.npm-intellisense",
		"jacano.vscode-pnpm",
		"redhat.vscode-yaml",
		"lihui.vs-color-picker",
		"github.vscode-github-actions",
		"stylelint.vscode-stylelint"
	]
}
`,
}

export const bandaTemplateConfig: BandaConfig = { templates : {
	'pp-gitignore' : {
		input  : wsGeneralTemplates.gitignore,
		output : './.gitignore',
		opts   : { overwrite: 'ask' },
	},
	'pp-eslint' : {
		input  : wsGeneralTemplates.eslintConfig,
		output : './eslint.config.js',
		opts   : { overwrite: 'ask' },
	},
	'pp-editorconfig' : {
		input  : wsGeneralTemplates.editorconfig,
		output : './.editorconfig',
		opts   : { overwrite: 'ask' },
	},
	'pp-npmrc' : {
		input  : wsGeneralTemplates.npmrc,
		output : './.npmrc',
		opts   : { overwrite: 'ask' },
	},
	'pp-changeset' : {
		input  : wsGeneralTemplates.changeset,
		output : './.changeset/config.json',
		opts   : { overwrite: 'ask' },
	},
	'pp-vscode-settings' : {
		input  : wsGeneralTemplates.vscodeSettings,
		output : './.vscode/settings.json',
		opts   : { overwrite: 'ask' },
	},
	'pp-vscode-extensions' : {
		input  : wsGeneralTemplates.vscodeExtensions,
		output : './.vscode/extensions.json',
		opts   : { overwrite: 'ask' },
	},
} }
