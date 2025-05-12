import {
	name,
	bin,
	version,
	homepage,
} from '../../package.json'

export const PKG_NAME = name
export const BIN_NAME = Object.keys( bin )[0]
export const VERSION = version
export const HOMEPAGE = homepage
export const HELP_URL = HOMEPAGE

export const CMD = {
	CONSTANTS  : 'const',
	CHECK      : 'check',
	TRANSFORM  : 'transform',
	ALIASES    : 'alias',
	CONFIG     : 'config',
	ALIAS_EXEC : 'x',
} as const

export const CONFIG_EXTS = [
	'js',
	'mjs',
	'cjs',
	'ts',
	'mts',
	'cts',
] as const

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

export const PKG_MANAGER = {
	BUN  : 'bun',
	NPM  : 'npm',
	PNPM : 'pnpm',
	YARN : 'yarn',
} as const

export const RUNTIME = {
	NODE : 'node',
	BUN  : 'bun',
	DENO : 'deno',
} as const
