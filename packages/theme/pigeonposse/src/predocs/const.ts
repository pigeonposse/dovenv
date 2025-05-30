import { addExtension } from './_utils'

export const ID = {
	theme  : 'theme',
	plugin : 'plugin',
	preset : 'preset',
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
	lib : 'library',
} as const

export const FILE_NAME_BASE = {
	EXAMPLES     : 'examples',
	API          : 'api',
	INDEX        : 'index',
	WS           : 'ws',
	GUIDE        : 'guide',
	CONTRIBUTORS : 'contributors',
	README       : 'README',
	/**
	 * must be used for add precontent in README packages
	 */
	PRE_README   : 'pre',
} as const

export const FILE_NAME = addExtension( FILE_NAME_BASE, 'md' )
