import type { Role } from './types'

/**
 * Contributor roles object with their names and emojis.
 */
export const CONTRIBUTOR_ROLE = {
	author : {
		name  : 'Author',
		emoji : '👑',
		desc  : 'Author of the project.',
	},
	developer : {
		name  : 'Developer',
		emoji : '💻',
		desc  : 'Contributor for the development of the project. Code, docs, etc.',
	},
	contributor : {
		name  : 'Contributor',
		emoji : '💻',
		desc  : 'Contributor for the development of the project. Code, docs, etc.',
	},
	mantainer : {
		name  : 'Mantainer',
		emoji : '🚧',
		desc  : 'Maintainer of the project. Code, docs, etc.',
	},
	designer : {
		name  : 'Designer',
		emoji : '💄',
		desc  : 'Contributor for the design of the project. Images, icons, etc.',
	},
	organization : {
		name  : 'Organization',
		emoji : '🏢',
		desc  : 'Organization of the project.',
	},
	sponsor : {
		name  : 'Sponsor',
		emoji : '🤝',
		desc  : 'Sponsor of the project.',
	},
	translator : {
		name  : 'Translator',
		emoji : '🌏',
		desc  : 'Translator for the project.',
	},
} as const satisfies Role
