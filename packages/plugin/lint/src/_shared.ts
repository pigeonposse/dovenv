import { homepage } from '../package.json'

export const CMDS = {
	staged     : 'staged',
	stylelint  : 'stylelint',
	eslint     : 'eslint',
	commitlint : 'commitlint',
	publint    : 'publint',
	custom     : 'custom',
} as const

import type { CommandUtils } from '@dovenv/core'

export class LintSuper<Opts = unknown> {

	// subtitle? : string
	constructor( public opts: Opts | undefined, public utils: CommandUtils ) {

		this.utils.title   = 'lint'
		this.utils.helpURL = homepage
		// if ( this.subtitle ) {

		// 	this.utils.title   = this.utils.title + '.' + this.subtitle
		// 	this.utils.helpURL = this.utils.helpURL + '#' + this.subtitle

		// }

	}

	protected transformHelpInfo( v:string ) {

		this.utils.title   = this.utils.title + '.' + v
		this.utils.helpURL = this.utils.helpURL + '#' + v

	}

}
