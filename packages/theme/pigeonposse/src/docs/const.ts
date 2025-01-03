export const ID = {
	theme  : 'theme',
	plugin : 'plugin',
	config : 'config',
	core   : 'core',
} as const

export const docsRoute = { guide: 'guide' } as const

const {
	core:_,
	...rest
} = ID

export const TYPE = {
	...rest,
	lib : 'lib',
} as const

export const ICON = {
	[ID.core]   : '📚',
	[ID.plugin] : '🔌',
	[ID.theme]  : '🎨',
	[ID.config] : '🔧',
	getStarted  : `🏁`,
	utils       : '⚒️',
	create      : '🚀',
	examples    : '💡',
	api         : '📖',
	package     : '📦',
} as const

export const FILE_NAME_BASE = {
	EXAMPLES     : 'examples',
	API          : 'api',
	INDEX        : 'index',
	WS           : 'ws',
	GUIDE        : 'guide',
	CONTRIBUTORS : 'contributors',
	README       : 'README',
} as const

const addExtension = <T extends Record<string, string>>( base: T ) => {

	const extension = '.md'
	return Object.fromEntries(
		Object.entries( base ).map( ( [ key, value ] ) => [ key, `${value}${extension}` ] ),
	) as { [K in keyof T]: `${T[K]}${typeof extension}` }

}

export const FILE_NAME = addExtension( FILE_NAME_BASE )
