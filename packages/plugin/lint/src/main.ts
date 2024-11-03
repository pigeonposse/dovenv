import * as dovenvEslintConfig    from '@dovenv/eslint-config'
import * as dovenvStylelintConfig from '@dovenv/stylelint-config'
import { defineConfig }           from 'dovenv'

import {
	runEslint,
	runLintStaged,
	runStylelint,
} from './run'

import type stylelint from 'stylelint'

type Config = {
	staged?    : Record<string, string>
	stylelint? : stylelint.LinterOptions
	eslint?    : string[]
}

export {
	runEslint,
	runLintStaged,
	runStylelint,
	dovenvEslintConfig,
	dovenvStylelintConfig,
	Config,
}

export const config = ( conf?: Config ) => defineConfig( { custom : {
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

			const config: stylelint.LinterOptions = {
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
} } )
