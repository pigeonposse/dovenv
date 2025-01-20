
import { deepmerge } from '@dovenv/core/utils'

import { ID } from './const'

import type {
	ObjectKeys,
	ObjectValues,
} from '@dovenv/core/utils'

export type EmojiValue = ObjectValues<typeof EMOJI>
export type EmojiKey = ObjectKeys<typeof EMOJI>
export type Emoji = string | false
export type EmojiObject = Record<EmojiKey, Emoji> | Record<string, Emoji>

export const EMOJI = {
	[ID.core]         : '🌞',
	[ID.plugin]       : '🔌',
	[ID.plugin + 's'] : '🎨',
	[ID.theme]        : '🎨',
	[ID.theme + 's']  : '🎨',
	[ID.config]       : '⚙️',
	library           : '📚',
	getStarted        : `🏁`,
	index             : '📍',
	utils             : '⚒️',
	create            : '🚀',
	usage             : '📄',
	template          : '🖼️',
	templates         : '🖼️',
	media             : '🎥',
	todo              : '✅',
	example           : '💡',
	examples          : '💡',
	api               : '📖',
	tutorial          : '🎓',
	tutorials         : '🎓',
	blog              : '📝',
	docs              : '📚',
	web               : '🌐',
	package           : '📦',
	more              : '➕',
	about             : '✨',
	convert           : '🔄',
	preset            : '💾',
	presets           : '💾',
	bug               : '🐛',
	ai                : '🤖',
	extension         : '🧩',
	extensions        : '🧩',
	installation      : '🔑',
	feat              : '🌟',
	feats             : '🌟',
	feature           : '🌟',
	features          : '🌟',
	cli               : '🔢',
	docker            : '🐳',
	server            : '🗄️',
	setup             : '🎉',
	license           : '📜',
	lint              : '🧹',
	donate            : '❤️',
	development       : '👨‍💻',
	dev               : '👨‍💻',
	info              : 'ℹ️',
	toolkit           : '🧰',
	test              : '✅',
	workspace         : '📂',
	repo              : '🗃️',
	repos             : '🗃️',
	repository        : '🗃️',
} as const

export const getEmoji = ( list: EmojiObject | undefined, key: string ) => {

	try {

		if ( list && key in list ) {

			const e =  list[key as keyof EmojiObject]
			if ( e !== false ) return e

		}
		return undefined

	}
	catch ( _ ) {

		return undefined

	}

}

export const getEmojiList = ( opts:EmojiObject | false | undefined ): EmojiObject | undefined => {

	return opts === false
		? undefined
		// @ts-ignore
		: deepmerge(
			EMOJI,
			opts || {},
		)

}
