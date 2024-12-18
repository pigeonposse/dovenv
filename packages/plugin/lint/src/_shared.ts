import { PluginCore } from '@dovenv/core'

import { homepage } from '../package.json'

export const CMDS = {
	staged     : 'staged',
	stylelint  : 'stylelint',
	eslint     : 'eslint',
	commitlint : 'commitlint',
	custom     : 'custom',
} as const

export class LintSuper<Conf = unknown> extends PluginCore<Conf> {

	title = 'lint'
	helpURL = homepage

}
