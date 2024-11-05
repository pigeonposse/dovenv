// @ts-ignore
import * as dovenvEslintConfig from '@dovenv/eslint-config'
// @ts-ignore
import * as dovenvStylelintConfig from '@dovenv/stylelint-config'

import { runCommitlint } from './commitlint'
import { runEslint }     from './eslint'
import { runLintStaged } from './staged'
import { runStylelint }  from './style'

import type { CommitlintConfig }        from './commitlint'
import type { EslintConfig }            from './eslint'
import type { LintStagedConfig }        from './staged'
import type { StylelintConfig }         from './style'
import type { Config as DoveEnvConfig } from 'dovenv'

export type Config = {
	staged?     : LintStagedConfig
	stylelint?  : StylelintConfig
	eslint?     : EslintConfig
	commitlint? : CommitlintConfig
}

export {
	runEslint,
	runLintStaged,
	runStylelint,
	dovenvEslintConfig,
	dovenvStylelintConfig,
}

export const config = ( conf?: Config ): DoveEnvConfig => ( { custom : {
	'lint-staged' : {
		desc : 'Lint staged files',
		fn   : async ( ) => {

			await runLintStaged( conf?.staged )

		},
	},
	'stylelint' : {
		desc : 'Lint CSS files configuration',
		opts : {
			fix : {
				desc : 'Fix stylelint errors',
				type : 'boolean',
			},
			files : {
				desc : 'Files to lint',
				type : 'array',
			},
		},
		fn : async ( { opts } ) => {

			const config: StylelintConfig = {
				...conf?.stylelint,
				...( opts?.files ? { files: opts?.files as string[] } : {} ),
				...( opts?.fix ? { fix: true } : {} ),
			}

			const lint = await runStylelint( config )
			console.log( lint )

		},
	},
	'eslint' : {
		desc : 'Lint JS/TS/MD/JSON/YAML.. files',
		fn   : async () => {

			await runEslint()

		},
	},
	'commitlint' : {
		desc : 'Lint commit messages',
		fn   : async () => {

			await runCommitlint( conf?.commitlint )

		},
	},
} } )
