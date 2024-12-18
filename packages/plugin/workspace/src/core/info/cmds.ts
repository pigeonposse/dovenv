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

		let data

		const usefulCmds = this.opts?.info?.usefulCmds ? this.opts.info.usefulCmds : undefined

		if ( !usefulCmds || !usefulCmds.length ) return
		const lastIndex = usefulCmds.length - 1

		data = ''

		for ( const [ index, cmd ] of usefulCmds.entries() ) {

			data += this.style.table( [
				[ 'Command', this.style.section.b( cmd.cmd ) ],
				[ 'Description', cmd.desc ],
				...( cmd.info ? [ [ 'Info', this.style.section.a( cmd.info ) ] ] : [] ),
			] )

			if ( index !== lastIndex ) data += '\n\n'

		}

		return this.style.box( {
			data,
			border : false,

		} )

	}

	async #fn() {

		this._title( 'Useful commands' )
		const cmds = await this.get()
		if ( cmds ) console.log( cmds )
		else console.warn( this.style.warn.p( 'No commands found' ) )

	}

	async run( ) {

		return await this._envolvefn( this.#fn( ) )

	}

}
