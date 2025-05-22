import {
	getMatch,
	md2html,
	md2terminal,
} from '@dovenv/core/utils'

import { package2Contributors } from './parse'
import { CommandUtils }         from '../_super/types'

import type {
	ContributorsOpts,
	ContributorsParams,
	Role,
	RoleKey,
	RoleMap,
} from './types'

type ContributorsContentConfig = {
	/**
	 * the name Column.
	 *
	 * @default true
	 */
	name?  : boolean
	/**
	 * the image Column.
	 *
	 * @default true
	 */
	image? : boolean
	/**
	 * the role Column.
	 *
	 * @default true
	 */
	role?  : boolean
}

type ContributorsGetOpts = ContributorsOpts & { content?: ContributorsContentConfig }

export class Contributors<
	R extends RoleMap = Role,
> {

	opts            : ContributorsOpts | undefined
	protected utils : CommandUtils | undefined

	constructor( config?: ContributorsParams<R> ) {

		this.utils = config?.utils

		if ( !config?.opts || !config?.opts.role || !config?.opts.member ) {

			if ( this.utils?.pkg ) this.opts = package2Contributors( this.utils.pkg )

		}
		else this.opts = config?.opts as ContributorsOpts

		// console.debug( { contributorsOpts: this.opts } )

	}

	/**
	 * Filter the contributors by role using a list of role IDs.
	 *
	 * @param   {RoleKey[]}                             role - Role IDs to filter by.
	 * @returns {Promise<ContributorsOpts | undefined>}      - The filtered contributors.
	 */
	async filterByRole( role: RoleKey[] ): Promise<ContributorsOpts | undefined> {

		if ( !this.opts?.member || !this.opts?.role ) throw new Error( 'Missing role or member' )

		if ( !role.length ) return undefined

		const filteredRoles = Object.fromEntries(
			Object.entries( this.opts.role ).filter( ( [ key ] ) => role.includes( key ) ),
		)
		return {
			role   : filteredRoles,
			member : this.opts.member.filter( m => role.includes( m.role ) ),
		}

	}

	/**
	 * Filter the contributors by role using a pattern.
	 *
	 * Uses the `getMatch` utility to filter the role IDs using the provided pattern.
	 * The filtered role IDs are then passed to the `filterByRole` method.
	 *
	 * @param   {string[]}                              pattern - Pattern to filter the role IDs with.
	 * @returns {Promise<ContributorsOpts | undefined>}         - The filtered contributors.
	 */
	async filterByRolePattern( pattern: string[] ): Promise<ContributorsOpts | undefined> {

		if ( !this.opts?.role ) throw new Error( 'Missing role' )
		const roleIds = getMatch( Object.keys( this.opts.role ), pattern )
		return await this.filterByRole( roleIds )

	}

	/**
	 * Converts the HTML content of the contributors table to Markdown.
	 *
	 * @param   {object}          [opts] - Options object.
	 * @returns {Promise<string>}        - The Markdown content of the contributors table.
	 */
	async getMarkdownContent( opts?: ContributorsGetOpts ): Promise<string> {

		const role   = opts?.role || this.opts?.role
		const member = opts?.member || this.opts?.member

		if ( !member || !role ) throw new Error( 'Missing role or member' )

		const showName  = opts?.content?.name ?? true
		const showImage = opts?.content?.image ?? true
		const showRole  = opts?.role !== undefined ? opts.role : true

		const headerParts: string[]  = []
		const dividerParts: string[] = []

		if ( showName ) {

			headerParts.push( 'Name' )
			dividerParts.push( '----' )

		}
		if ( showRole ) {

			headerParts.push( 'Role' )
			dividerParts.push( '----' )

		}
		if ( showImage ) {

			headerParts.push( 'Image' )
			dividerParts.push( '-----' )

		}

		const header  = `| ${headerParts.join( ' | ' )} |`
		const divider = `| ${dividerParts.join( ' | ' )} |`

		const rows: string[] = member.map( m => {

			const profileUrl = m.url || `https://github.com/${m.ghUsername}`
			const avatarUrl  = m.avatar || `https://github.com/${m.ghUsername}.png?s=75`
			const memberRole = role[m.role]

			const columns: string[] = []

			if ( showName ) {

				columns.push( `[${m.name}](${profileUrl})` )

			}

			if ( showRole ) {

				const roleText = `${memberRole?.emoji ?? ''} ${memberRole?.name ?? ''}`.trim()
				columns.push( roleText )

			}

			if ( showImage ) {

				columns.push( `![${m.name}](${avatarUrl})` )

			}

			return `| ${columns.join( ' | ' )} |`

		} )

		return [
			'## Contributors',
			'',
			header,
			divider,
			...rows,
		].join( '\n' )

	}

	/**
	 * Retrieves the HTML content of a table containing the contributors.
	 *
	 * Optionally takes an object with the same shape as the class constructor options.
	 * If the `role` or `member` properties are not provided, they default to the class constructor options.
	 *
	 * @param   {object}          [opts] - Options object.
	 * @returns {Promise<string>}        - The HTML content of the contributors table.
	 */
	async getHtmlContent( opts?: ContributorsGetOpts ): Promise<string> {

		return md2html( await this.getMarkdownContent( opts ) )

	}

	/**
	 * Retrieves the contributors table content formatted for the terminal.
	 *
	 * Optionally takes an object with the same shape as the class constructor options.
	 * If the `role` or `member` properties are not provided, they default to the class constructor options.
	 *
	 * @param   {object}          [opts] - Options object.
	 * @returns {Promise<string>}        - The terminal-formatted content of the contributors table.
	 */

	async getTerminalContent( opts?: ContributorsGetOpts ): Promise<string> {

		return await md2terminal( await this.getMarkdownContent( opts ) )

	}

	/**
	 * Logs the contributors table as a formatted string to the terminal.
	 *
	 * @param   {object}        [opts] - Options object.
	 * @returns {Promise<void>}        - The result of logging the contributors table.
	 */
	async showTerminalOutput( opts?: ContributorsGetOpts ): Promise<void> {

		console.log( await this.getTerminalContent( opts ) )

	}

}
