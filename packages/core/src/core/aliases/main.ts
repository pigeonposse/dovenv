
import {
	exec,
	validate,
} from '@dovenv/utils'

import { Command } from '../../_shared/cmd'

import type { ArgvParsed } from '../../_shared/types'

export type AliasesConfig = {
	[key in string]: {
		/** description of your alias */
		desc : string
		/**
		 * command of your alias.
		 * @example
		 * {
		 *   cmd : 'dovenv check'
		 * }
		 * @example
		 * {
		 *   cmd : async () => { console.log( 'Hello World' ) }
		 * }
		 * @example
		 * {
		 *   cmd : async ({exec}) => await exec.command('node ./src/bin.js')
		 * }
		 * @example
		 * {
		 *   cmd : async ({exec}) => await exec.runtime('./src/bin.js')
		 * }
		 */
		cmd  : string | ( ( params: {
			/** Dovenv Configuration */
			config : Aliases['config']
			/** Options passed affter cmd */
			opts   : string[] | undefined
			/** Execute functions */
			exec: {
				/**
				 * Executes a given command in the shell.
				 * @param {string} command - The command to be executed.
				 * @returns {Promise<string>} - Resolves with the output of the command.
				 * @example
				 * command('ls -la')
				 */
				command : typeof exec

				/**
				 * Executes a command in the shell based in your current JS runtime.
				 * @param {string} runtime - The runtime (e.g., `node`) to use for execution.
				 * @returns {Promise<string>} - Resolves with the runtime execution result.
				 * @example
				 * runtime('./src/bin.js')
				 */
				runtime : typeof exec

				/**
				 * Executes a command in the shell based in your current JS manager.
				 * @param {string} pkgManager - The package manager (e.g., `npm`, `yarn`, `pnpm`) to use for execution.
				 * @returns {Promise<string>} - Resolves with the output of the package manager command.
				 */
				pkgManager : typeof exec

				/**
				 * Executes dovenv command in shell.
				 * @param {string} cmd - The command to execute.
				 * @returns {Promise<string>} - Resolves with the binary execution output.
				 * @example
				 * current('alias') // Return the dovenv aliases
				 */
				current : typeof exec

				/**
				 * Executes a command related to a package's binary.
				 * @type {Aliases['execPkgBin']}
				 */
				pkgBin : Aliases['execPkgBin']
			}
			/** workspace data to be used */
			data: {
				/**
				 * The runtime to be used (e.g., `node`).
				 */
				runtime        : string
				/**
				 * The package manager to be used (e.g., `npm`, `yarn`, `pnpm`).
				 */
				pkgManager     : string
				/**
				 * Some package manager commands.
				 */
				pkgManagerCmds : ReturnType<Aliases['getPkgManagerCmds']>
				/**
				 * Workspace is a monorepo?.
				 */
				isMonorepo     : boolean
				/**
				 * The binary to be executed (e.g., `eslint`, `vite`).
				 */
				bin            : string
			}
		} ) => Promise<void> )
	}
}

export class Aliases extends Command<AliasesConfig> {

	argv
	load
	id
	title = 'alias'

	schema = validate.record(
		validate.string(),
		validate.object( {
			desc : validate.string(),
			cmd  : validate.string()
				.or(
					validate.function()
						.returns( validate.promise( validate.void() ) ),
				),
		} ).strict(),
	).optional()

	constructor( argv? : ArgvParsed ) {

		super( argv?.config?.alias, argv?.config )

		this.id   = this.consts.CMD.ALIASES
		this.argv = argv
		this.load = this.spinner()

	}

	async #list() {

		if ( !this.opts || Object.keys( this.opts ).length === 0 ) return

		for ( const key of Object.keys( this.opts ) ) {

			const { desc } = this.opts[key]

			console.log( this.style.indent( this.style.info.li( key, desc  ) ) )

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
				this.style.info.h(
					keyGetted !== this.consts.CMD.ALIAS_EXEC
						? `The key provided ${this.style.badge( this.argv?.cmds?.at( -1 ) )} does not exist.\n`
						: 'No key provided.\n',
				),
				this.style.info.msg( ` Available keys:`, this.style.color.dim.italic( Object.keys( this.opts ).join( ', ' ) ) ),
			)

			return

		}

		const value = this.opts[key]
		const cmd   = value.cmd

		const getOpts = () => {

			const getValuesAfter = ( array: string[], value: string ): string[] =>
				array.includes( value ) ? array.slice( array.indexOf( value ) + 1 ) : []
			const values         = getValuesAfter( this.process.argv, this.consts.CMD.ALIAS_EXEC )

			const opts = values.slice( 1 ) // remove cmd key
			return opts || ''

		}

		if ( !cmd ) return

		if ( typeof cmd === 'function' ) {

			// this.argv?.opts
			const data = {
				runtime        : this.getRuntime(),
				pkgManager     : this.getPkgManager(),
				pkgManagerCmds : this.getPkgManagerCmds(),
				isMonorepo     : this.isMonorepo(),
				bin            : this.argv?.bin || this.consts.BIN_NAME,
			}
			await cmd( {
				data,
				config : this.config,
				opts   : getOpts(),
				exec   : {
					command    : async ( v:string ) => await exec( `${v}` ),
					runtime    : async ( v:string ) => await exec( `${data.runtime} ${v}` ),
					pkgManager : async ( v:string ) => await exec( `${data.pkgManager} ${v}` ),
					current    : async ( v:string ) => await exec( `${data.bin} ${v}` ),
					pkgBin     : async ( ...v: Parameters<Aliases['execPkgBin']> ) => await this.execPkgBin( ...v ),
				},
			} )

		}
		else if ( typeof cmd === 'string' ) await exec( cmd )

	}

	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		await this.validateSchema( this.opts )

		if ( this.argv?.cmds?.includes( this.id ) ) await this.#list()
		else if ( this.argv?.cmds?.includes( this.consts.CMD.ALIAS_EXEC ) )  await this.#exec()

	}

	async run() {

		return await this.catchFn( this.#fn( ) )

	}

}
