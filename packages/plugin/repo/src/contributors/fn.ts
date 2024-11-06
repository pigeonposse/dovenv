
export type Role<ID extends string = string> = {
	[key in ID]: {
		/** Name of the role */
		name  : string
		/** Emoji of the role */
		emoji : string
	}
}
export type Contributor<ID extends string = string> = {
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
}

export const contributorsToHtml = <
	ID extends string,
	R extends Role<ID>,
>(
	role: R,
	member: Contributor<Extract<keyof R, string>>[],
): string => {

	return `<table><tbody><tr>${member
		.map( ( m, index ) => {

			const profileUrl = m.url || `https://github.com/${m.ghUsername}`
			const avatarUrl  = m.avatar || `https://github.com/${m.ghUsername}.png?s=75`
			const memberRole = role[m.role] // Accedemos al rol directamente desde `roles`

			return `
				<td align="center" valign="top" width="11%">
					<a href="${profileUrl}">
						<img src="${avatarUrl}" width="75" height="75" alt="${m.name.trim()}'s Avatar">
						<br />
						${m.name.trim()}
						<br />
						<small>${memberRole?.emoji || ''} ${memberRole?.name || ''}</small>
					</a>
				</td>
				${( index + 1 ) % 9 === 0 ? '</tr><tr>' : ''}
			`

		} )
		.join( '' )}</tr></tbody></table>`

}

