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
