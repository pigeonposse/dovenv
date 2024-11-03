import type { Config } from '../types'

export type ArgvPreParsed = {
	[x: string] : unknown
	_           : ( string | number )[]
	$0          : string
}

export type ArgvParsed = {
	cmds?   : Command
	opts?   : Options
	config? : Config
}
export type Command = ( string | number )[]
export type Options = { [x: string]: unknown }
