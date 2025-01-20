/* eslint-disable @stylistic/object-curly-newline */
import {
	deepmergeCustom,
} from '@dovenv/utils'

import { schema }         from './schema'
import { Command }        from '../_shared/cmd'
import { GLOBAL_OPTIONS } from '../_shared/const'

import type {
	Cli,
	CustomConfig,
	ShowHelpFn,
} from './types'
import type {
	ArgvPreParsed,
} from '../_shared/types'
import type { Config } from '../types'

export type {
	CustomConfig,
}

export const mergeCustomConfig = deepmergeCustom<CustomConfig>( {} )

export class Custom extends Command<CustomConfig> {

	schema = schema

	cli

	constructor( cli: Cli, opts?: CustomConfig, config?: Config ) {

		super( opts, config )

		this.cli = cli

	}

	#setCMDs( props: CustomConfig ) {

		for ( const [ key, prop ] of Object.entries( props ) ) {

			// is not necesary
			// const coreCMDS = Object.values( this.consts.CMD ) as string[]
			// const isCore   = prop.settings && 'core' in prop.settings && prop.settings.core === true
			// if ( !isCore && coreCMDS.includes( key ) )
			// 	throw new this.Error( `Command ${key} is used in core configuration. Please change it!` )

			const help = ( level?: string ) => this.cli.showHelp( level || 'log' )
			// @ts-ignore
			this.cli.command( {
				command : key,
				desc    : prop.settings?.hide ? false : prop.desc.endsWith( '.' ) ? prop.desc.slice( 0, -1 ) : prop.desc,
				// @ts-ignore
				builder : async argv => await this.#builder( argv, prop, help ),
				handler : async argv => await this.#handler( argv, key, prop, help ),

			} )

		}

	}

	async #builder( argv: Cli, prop: CustomConfig[number], showHelp: ShowHelpFn ) {

		if ( prop.opts ) {

			argv.group( Object.keys( prop.opts ), 'Options:' )
			argv.options( prop.opts )

		}
		if ( prop.cmds ) {

			for ( const [ key, cmd ] of Object.entries( prop.cmds ) ) {

				// @ts-ignore
				argv.command( {
					command : key,
					desc    : prop.settings?.hide ? false : cmd.desc,
					builder : async argvChild => await this.#builder( argvChild, {
						...cmd,
						fn : prop.fn,
					}, showHelp ),
					handler : async argvChild => await this.#handler( argvChild, key, prop, showHelp ),

				} )

			}

		}
		if ( prop.examples )
			prop.examples.forEach( example => argv.example( example.cmd, example.desc ) )

		return argv

	}

	async #handler( argv: ArgvPreParsed, name: string, prop: CustomConfig[number], showHelp: ShowHelpFn ) {

		const {
			_: cmds,
			$0,
			...opts
		} = argv

		// console.debug( { argv } )

		const time = this.performance()

		const title = this.config?.name || undefined
		const desc  = this.config?.desc || undefined

		const isQuiet = opts?.[GLOBAL_OPTIONS.QUIET.key] as boolean || false

		if ( title && !isQuiet ) this.setMainTitle( title, desc )

		this.title       = name
		this.description = prop.desc
		if ( !isQuiet ) this.setTitle()

		try {

			if ( prop.settings?.wrapConsole === false ) this.log.restoreConsole()
			else this.log.wrapConsole()

			await prop.fn( {
				bin    : $0,
				cmds,
				opts,
				config : this.config,
				showHelp,
			} )

			// if ( prop.settings?.wrapConsole === false ) this.log.w()
			if ( !isQuiet ) this.setTime( time.prettyStop() )

		}
		catch ( e ) {

			// if ( prop.settings?.wrapConsole === false ) this.log.wrapAll()

			this.log.error( e )
			if ( !isQuiet ) this.setTime( time.prettyStop() )

			this.exitWithError()

		}

	}

	async run() {

		if ( !this.opts ) return

		try {

			await this.validateSchema( this.opts )
			this.#setCMDs( this.opts )

		}
		catch ( e ) {

			this.title       = 'custom'
			this.description = 'Custom commands'
			// set title only in case of error
			this.setTitle()
			this.log.error( e )

			return

		}

	}

}
