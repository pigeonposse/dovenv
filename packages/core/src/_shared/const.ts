import {
	name,
	bin,
	version,
} from '../../package.json'

export const PKG_NAME = name
export const BIN_NAME = Object.keys( bin )[0]
export const VERSION = version

export const CMD = {
	CONSTANTS  : 'const',
	CHECK      : 'check',
	TRANSFORM  : 'transform',
	ALIASES    : 'alias',
	ALIAS_EXEC : 'x',
} as const

export const OPTIONS = { KEY : {
	key   : 'key',
	alias : 'k',
} } as const
export const GLOBAL_OPTIONS = {
	VERSION : {
		key   : 'version',
		alias : 'v',
	},
	HELP : {
		key   : 'help',
		alias : 'h',
	},
	CONFIG : {
		key   : 'config',
		alias : 'c',
	},
	VERBOSE : { key: 'verbose' },
	QUIET   : { key: 'silent' },
} as const
