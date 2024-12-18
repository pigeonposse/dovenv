import {
	box,
	html2terminal,
	getMatch,
} from '@dovenv/core/utils'

export type Role<ID extends string = string> = {
	[key in ID]: {
		/** Name of the role */
		name  : string
		/** Emoji of the role */
		emoji : string
		/** Description of the role */
		desc? : string
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

export class Contributors<
	ID extends string,
	R extends Role<ID>,
> {

	opts
	constructor( opts?: {
		role   : R
		member : Contributor<Extract<keyof R, string>>[]
	} ) {

		if ( !opts || !opts.role || !opts.member ) throw new Error( 'No members or roles provided' )
		this.opts = opts

	}

	async getRoles() {

		return this.opts.role

	}

	async getMembers() {

		return this.opts.member

	}

	async filterByRole( role: ( keyof ID )[] ): Promise<{
		role?   : R
		member? : Contributor<Extract<keyof R, string>>[]
	} | undefined > {

		const roleIds = role as string[]
		if ( !roleIds.length ) return undefined
		const filteredRoles = Object.fromEntries(
			Object.entries( this.opts.role ).filter( ( [ key ] ) => roleIds.includes( key ) ),
		) as R
		return {
			role   : filteredRoles,
			member : this.opts.member.filter( m => roleIds.includes( m.role ) ),
		}

	}

	async filterByRolePattern( pattern: string[] ): Promise<{
		role?   : R
		member? : Contributor<Extract<keyof R, string>>[]
	} | undefined > {

		const roleIds = getMatch( Object.keys( this.opts.role ), pattern )
		return this.filterByRole( roleIds as ( keyof ID )[] )

	}

	async getHtmlContent( opts?: {
		role?   : R
		member? : Contributor<Extract<keyof R, string>>[]
	} ) {

		const role   = opts?.role || this.opts.role
		const member = opts?.member || this.opts.member

		return `<h1>Contributors</h1>\n\n<table><tbody><tr>${member
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

	async showTerminalOutput( opts?: {
		role?   : R
		member? : Contributor<Extract<keyof R, string>>[]
	} ) {

		console.log( box( await html2terminal( await this.getHtmlContent( opts ) ), {
			padding     : 1,
			borderColor : 'black',
			dimBorder   : true,
		} ) )

	}

}
