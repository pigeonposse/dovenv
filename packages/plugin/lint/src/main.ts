import { CMDS } from './_shared'
import { Lint } from './lib'

import type { Config }                 from './lib'
import type { Config as DovenvConfig } from '@dovenv/core'

export * from './lib'

/**
 * Configures and returns a DovenvConfig object for linting tools.
 *
 * @param   {Config}       [conf] - Optional configuration object for linting.
 * @returns {DovenvConfig}        A configuration object with custom lint commands and descriptions.
 *
 *                                Provides linting commands for different file types and commit messages:
 *                                - `staged`: Lints staged git files.
 *                                - `stylelint`: Lints CSS/SCSS/LESS/SASS/PostCSS files with options to fix errors and specify files.
 *                                - `eslint`: Lints JS/TS/MD/JSON/YAML files.
 *                                - `commitlint`: Lints commit messages, either the last commit message or a specified message.
 *
 *                                Examples include linting CSS files, JS files, commit messages, and staged files.
 */
export const lintPlugin = ( conf?: Config ): DovenvConfig => ( { custom : { lint : {
	desc : 'Linter tools',
	cmds : {
		[CMDS.staged]    : { desc: 'Lint staged git files' },
		[CMDS.stylelint] : {
			desc : 'Lint CSS/SCSS/LESS/SASS/PostCSS files configuration',
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
		},
		[CMDS.eslint] : {
			desc : 'Lint JS/TS/MD/JSON/YAML.. files',
			opts : {
				fix : {
					desc : 'Fix errors',
					type : 'boolean',
				},
				flags : {
					desc : 'Eslint custom flags',
					type : 'array',
				},
			},
		},
		[CMDS.commitlint] : {
			desc : 'Lint commit messages',
			opts : { message : {
				desc  : 'Set your commit message here. If is not provided, it will be read the last commit message',
				type  : 'string',
				alias : 'm',
			} },
			examples : [
				{
					cmd  : `$0 lint ${CMDS.commitlint} --message "Message to commit"`,
					desc : 'Lint commit specific message',
				},
				{
					cmd  : `$0 lint ${CMDS.commitlint}`,
					desc : 'Lint last commit last message',
				},
			],
		},
		[CMDS.publint] : {
			desc : 'PubLint',
			opts : { key : {
				alias : 'k',
				desc  : 'Key pattern',
				type  : 'array',
			} },
		},
		[CMDS.custom] : {
			desc : 'Custom lint function',
			opts : { key : {
				alias : 'k',
				desc  : 'Key pattern',
				type  : 'array',
			} },
		},

	},
	examples : [
		{
			cmd  : `$0 lint ${CMDS.stylelint}`,
			desc : 'Lint css/postcss files',
		},
		{
			cmd  : `$0 lint ${CMDS.eslint}`,
			desc : 'Lint JS/TS/MD/JSON/YAML.. files',
		},
		{
			cmd  : `$0 lint ${CMDS.commitlint}`,
			desc : 'Lint commit message',
		},
		{
			cmd  : `$0 lint ${CMDS.publint}`,
			desc : 'PubLint (Lint if a package is published right)',
		},
		{
			cmd  : `$0 lint ${CMDS.staged}`,
			desc : 'Lint staged files',
		},
	],
	fn : async ( {
		opts, cmds, showHelp, utils,
	} ) => {

		const lint = new Lint( conf, utils )
		if ( cmds?.includes( CMDS.staged ) ) await lint.staged( )
		else if ( cmds?.includes( CMDS.stylelint ) )
			await lint.stylelint( opts?.files as string[], opts?.fix as boolean )
		else if ( cmds?.includes( CMDS.eslint ) )
			await lint.eslint( opts?.fix ? [ '--fix' ] : ( opts?.flags ? opts?.flags as string[] : [] ) )
		else if ( cmds?.includes( CMDS.commitlint ) )
			await lint.commitlint( opts?.message as string )
		else if ( cmds?.includes( CMDS.publint ) )
			await lint.publint( opts?.key as string[] )
		else if ( cmds?.includes( CMDS.custom ) )
			await lint.custom( opts?.key as string[] )
		else showHelp( )

	},
} } } )

export default lintPlugin
