import * as dovenvEslintConfig from '@dovenv/eslint-config'
// @ts-ignore
import * as dovenvStylelintConfig from '@dovenv/stylelint-config'

import { CommitLint }    from './commitlint'
import { runEslint }     from './eslint'
import { runLintStaged } from './staged'
import { runStylelint }  from './style'

import type { CommitlintConfig } from './commitlint'
import type { EslintConfig }     from './eslint'
import type { LintStagedConfig } from './staged'
import type { StylelintConfig }  from './style'

export {
	CommitLint,
	runEslint,
	runLintStaged,
	runStylelint,
	dovenvEslintConfig,
	dovenvStylelintConfig,
}

export type Config = {
	/** Config for lint staged GIT files */
	staged?     : LintStagedConfig
	/** Config for lint CSS/SCSS/LESS/SASS/PostCSS files */
	stylelint?  : StylelintConfig
	/** Config for lint JS/TS/MD/JSON/YAML.. files */
	eslint?     : EslintConfig
	/** Config for lint commit messages */
	commitlint? : CommitlintConfig
}

/**
 * Lint class with all lint functions
 */
export class Lint {

	opts : Config = {}

	constructor( conf?: Config ) {

		if ( conf ) this.opts = conf

	}

	async eslint() {

		await runEslint( this.opts?.eslint )

	}

	async commitlint( userMsg?: string ) {

		const cl = new CommitLint( this.opts?.commitlint )
		await cl.run( userMsg )

	}

	async stylelint( files?: string[], fix?: boolean ) {

		const config: StylelintConfig = {
			...this.opts?.stylelint,
			...( files ? { files: files  } : {} ),
			...( fix ? { fix: true } : {} ),
		}

		await runStylelint( config )

	}

	async lintStaged() {

		await runLintStaged( this.opts?.staged )

	}

}
