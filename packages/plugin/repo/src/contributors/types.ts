import type { CommandUtils } from '../_super/types'

export type RoleKey = string | number | symbol
export type RoleValue = {
	/** Name of the role */
	name  : string
	/** Emoji of the role */
	emoji : string
	/** Description of the role */
	desc? : string
}
export type RoleMap = { [key: RoleKey]: RoleValue }
export type Role = RoleMap

export type Members<ID extends RoleKey> = {
	/** Role id */
	role       : ID
	/**
	   Github name id from user or organization.
	 */
	ghUsername : string // if user dont have a github profile, use organization profile
	/** Contributor name */
	name       : string
	/** Contributor avatar url */
	avatar?    : string
	/** Contributor profile url */
	url?       : string
}[]

export type ContributorsRoledOpts<R extends Role> = {
	role?   : R
	member? : Members<keyof R>
}

export type ContributorsOpts = ContributorsRoledOpts<Role>

export type ContributorsParams<R extends Role> = {
	opts?  : ContributorsRoledOpts<R>
	utils? : CommandUtils
}
export type ContributorsConfig<R extends Role> = {
	/**
	 * Set contributor roles.
	 *
	 * @example
	 * {
	 *     owner: { name: 'Owner', emoji: '👑' },
	 *     developer: { name: 'Developer', emoji: '🤝' },
	 *     organization: { name: 'Organization', emoji: '🏢' },
	 *     sponsor: { name: 'Sponsor', emoji: '🤝' },
	 *     translator: { name: 'Translator', emoji: '🌏' }
	 * },
	 */
	role   : R
	/**
	 * Set contributor members.
	 *
	 * @example
	 * [
	 *     { ghUsername: 'angelespejo', name: 'Angelo', role: 'author' },
	 *     { ghUsername: 'pigeonposse', name: 'PigeonPosse', role: 'organization' },
	 *  ]
	 */
	member : Members<keyof R>
}
