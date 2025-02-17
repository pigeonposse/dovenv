import { CommandSuper } from './cmd'

export type ArgvPreParsed = {
	[x: string] : unknown
	_           : ( string | number )[]
	$0          : string
}

export type ArgvParsed = {
	bin   : string
	cmds? : Command
	opts? : Options
	utils : CommandSuper
}
export type Command = ( string | number )[]
export type Options = { [x: string]: unknown }
export type Response<V> = Promise<V> | V
export type EmptyResponse = undefined | void
