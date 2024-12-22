import { joinPath } from '@dovenv/core/utils'

import { CONSTS } from '../../../.dovenv/main.js'

const { corePkg }   = CONSTS
const REPO_URL      = typeof corePkg.repository === 'string' ? corePkg.repository : corePkg.repository?.url
const REPO_CORE_URL = corePkg.repository
	? typeof corePkg.repository === 'string' ? corePkg.repository : joinPath( corePkg.repository.url || '', 'tree/main', corePkg.repository?.directory || '' )
	: ''

const ID        = {
	theme  : 'theme',
	plugin : 'plugin',
	config : 'config',
	core   : 'core',
} as const
const docsRoute = { guide: 'guide' }

const {
	core:_,
	...rest
} = ID
const TYPE = {
	...rest,
	lib : 'lib',
} as const

const ICON = {
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

export default {
	...CONSTS,
	ICON,
	TYPE,
	docsRoute,
	ID,
	REPO_URL,
	REPO_CORE_URL,
}
