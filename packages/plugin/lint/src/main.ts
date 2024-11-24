import { Lint } from './lint'

import type { Config }                  from './lint'
import type { Config as DoveEnvConfig } from '@dovenv/core'

export * from './lint'

const CMDS = {
	staged     : 'staged',
	stylelint  : 'stylelint',
	eslint     : 'eslint',
	commitlint : 'commitlint',
} as const

export const config = ( conf?: Config ): DoveEnvConfig => ( { custom : { lint : {
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
		[CMDS.eslint]     : { desc: 'Lint JS/TS/MD/JSON/YAML.. files' },
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
			cmd  : `$0 lint ${CMDS.staged}`,
			desc : 'Lint staged files',
		},
	],
	fn : async ( {
		opts, cmds, showHelp,
	} ) => {

		const lint = new Lint( conf )
		if ( cmds?.includes( CMDS.staged ) ) await lint.lintStaged(  )
		else if ( cmds?.includes( CMDS.stylelint ) )
			await lint.stylelint(  opts?.files as string[], opts?.fix as boolean )
		else if ( cmds?.includes( CMDS.eslint ) )
			await lint.eslint( )
		else if ( cmds?.includes( CMDS.commitlint ) )
			await lint.commitlint( opts?.message as string )
		else showHelp( )

	},
} } } )
