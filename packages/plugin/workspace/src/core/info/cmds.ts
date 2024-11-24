import { Super } from '../_super/main'

import type { InfoInterface } from './_super'

// default pigeonposse theme: usefulCmds = [
// 	{
// 		desc : 'Removes unreferenced packages from the store.',
// 		cmd  : 'pnpm store prune',
// 		info : 'https://pnpm.io/cli/store#prune',
// 	},
// 	{
// 		desc : 'Removes unnecessary packages.',
// 		cmd  : 'pnpm prune',
// 		info : 'https://pnpm.io/cli/prune',
// 	},
// 	{
// 		desc : 'Deletes metadata cache for the specified package(s).',
// 		cmd  : 'pnpm cache delete',
// 		info : 'https://pnpm.io/cli/cache-delete',
// 	},
// 	{
// 		desc : 'Checks for outdated packages.',
// 		cmd  : 'pnpm -r outdated',
// 		info : 'https://pnpm.io/cli/outdated',
// 	},
// 	{
// 		desc : 'Checks for known security issues with the installed packages.',
// 		cmd  : 'pnpm audit',
// 		info : 'https://pnpm.io/cli/audit',
// 	},
// 	{
// 		desc : 'Find where a package is in node_modules.',
// 		cmd  : 'find node_modules/.pnpm -name "*dovenv*"',
// 	},
// ]

export class UsefulCmds extends Super implements InfoInterface {

	async get() {

		let  data

		const usefulCmds = this.config?.info?.usefulCmds ? this.config.info.usefulCmds : undefined

		if ( !usefulCmds || !usefulCmds.length ) return

		data = '\n\n'
		for ( const cmd of usefulCmds ) {

			data += this._table( [
				[ 'Command', this._style.desc( cmd.cmd ) ],
				[ 'Description', cmd.desc ],
				[ 'Info', this._style.listValue( cmd.info  || 'none' ) ],
			] ) + '\n\n'

		}

		return this._box( {
			data,
			title : 'Commands',
		} )

	}

	async #fn() {

		this._title( 'Useful commands' )
		const cmds = await this.get()
		if ( cmds ) console.log( cmds )

		console.warn( 'No commands found' )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
