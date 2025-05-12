
import { exec } from '@dovenv/utils'

import { schema }        from './schema'
import { AliasesConfig } from './types'
import { Command }       from '../_shared/main'

import type { ArgvParsed } from '../../_shared/types'

export class Aliases extends Command<AliasesConfig> {

	argv
	load
	id

	constructor( argv : ArgvParsed ) {

		super( argv.utils.config?.alias, argv.utils )

		this.utils.title = 'alias'
		this.id          = this.consts.CMD.ALIASES
		this.argv        = argv
		this.load        = this.utils.spinner()
		this.schema      = schema( this.utils.validate ).optional()

	}

	async #list() {

		if ( !this.opts || Object.keys( this.opts ).length === 0 ) return

		for ( const key of Object.keys( this.opts ) ) {

			const { desc } = this.opts[key]

			console.log( this.utils.style.indent( this.utils.style.info.li( key, desc ) ) )

		}
		console.log( )

	}

	async #exec() {

		if ( !this.opts || Object.keys( this.opts ).length === 0 ) return

		const avaliableKeys = Object.keys( this.opts )
		const key           = avaliableKeys.find( k => this.argv?.cmds?.includes( k ) )

		if ( !key ) {

			const keyGetted = this.argv?.cmds?.at( -1 )
			console.log(
				this.utils.style.info.h(
					keyGetted !== this.consts.CMD.ALIAS_EXEC
						? `The key provided ${this.utils.style.badge( this.argv?.cmds?.at( -1 ) )} does not exist.\n`
						: 'No key provided.\n',
				),
				this.utils.style.info.msg( ` Available keys:`, this.utils.style.color.dim.italic( Object.keys( this.opts ).join( ', ' ) ) ),
			)

			return

		}

		const value = this.opts[key]
		const cmd   = value.cmd

		const getOpts = () => {

			const getValuesAfter = ( array: string[], value: string ): string[] =>
				array.includes( value ) ? array.slice( array.indexOf( value ) + 1 ) : []
			const values         = getValuesAfter( this.utils.process.argv, this.consts.CMD.ALIAS_EXEC )

			const opts = values.slice( 1 ) // remove cmd key
			return opts || ''

		}

		if ( !cmd ) return

		if ( typeof cmd === 'function' ) {

			// this.argv?.opts
			const data = {
				runtime        : this.utils.getRuntime(),
				pkgManager     : this.utils.getPkgManager(),
				pkgManagerCmds : this.utils.getPkgManagerCmds(),
				isMonorepo     : this.utils.isMonorepo(),
				bin            : this.argv?.bin || this.consts.BIN_NAME,
			}
			await cmd( {
				data,
				utils : this.utils,
				opts  : getOpts(),
				exec  : {
					command    : async ( v:string ) => await exec( `${v}` ),
					runtime    : async ( v:string ) => await exec( `${data.runtime} ${v}` ),
					pkgManager : async ( v:string ) => await exec( `${data.pkgManager} ${v}` ),
					current    : async ( v:string ) => await exec( `${data.bin} ${v}` ),
					pkgBin     : async ( ...v: Parameters<Aliases['utils']['execPkgBin']> ) => await this.utils.execPkgBin( ...v ),
				},
			} )

		}
		else if ( typeof cmd === 'string' ) await exec( cmd )

	}

	async #fn() {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		await this.validateSchema( this.opts )

		if ( this.argv?.cmds?.includes( this.id ) ) await this.#list()
		else if ( this.argv?.cmds?.includes( this.consts.CMD.ALIAS_EXEC ) ) await this.#exec()

	}

	async run() {

		return await this.utils.catchFn( this.#fn( ) )

	}

}
