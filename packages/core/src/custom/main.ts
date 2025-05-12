/* eslint-disable @stylistic/object-curly-newline */
import {
	deepmergeCustom,
} from '@dovenv/utils'

import { schema }         from './schema'
import { GLOBAL_OPTIONS } from '../_shared/const'
import { Command }        from '../core/_shared/main'

import type {
	Cli,
	CustomConfig,
	ShowHelpFn,
} from './types'
import type {
	ArgvPreParsed,
} from '../_shared/types'

export const mergeCustomConfig = deepmergeCustom<CustomConfig>( {} )

export class Custom extends Command<CustomConfig> {

	cli

	constructor( cli: Cli, opts: CustomConfig, utils: Command['utils'] ) {

		super( opts, utils )

		this.cli    = cli
		this.schema = schema( this.utils.validate )

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

		const time = this.utils.performance()

		const title = this.utils.config?.name || undefined
		const desc  = this.utils.config?.desc || undefined

		const isQuiet = opts?.[GLOBAL_OPTIONS.QUIET.key] as boolean || false

		if ( title && !isQuiet ) this.setMainTitle( title, desc )

		this.utils.title = name
		this.description = prop.desc
		if ( !isQuiet ) this.setTitle()

		try {

			if ( prop.settings?.wrapConsole === false ) this.utils.log.restoreConsole()
			else this.utils.log.wrapConsole()

			await prop.fn( {
				bin   : $0,
				cmds,
				opts,
				utils : this.utils,
				showHelp,
			} )

			// if ( prop.settings?.wrapConsole === false ) this.log.w()
			if ( !isQuiet ) this.setTime( time.prettyStop() )

		}
		catch ( e ) {

			// if ( prop.settings?.wrapConsole === false ) this.log.wrapAll()

			this.utils.log.error( e instanceof Error ? e.message : e || 'No error message specified' )
			if ( !isQuiet ) this.setTime( time.prettyStop() )

			this.utils.exitWithError()

		}

	}

	async run() {

		if ( !this.opts ) return

		try {

			await this.validateSchema( this.opts )
			this.#setCMDs( this.opts )

		}
		catch ( e ) {

			// this is for ubicate to  user that the error is in "custom"
			this.utils.title = 'custom'
			this.description = 'Custom commands'
			// set title only in case of error
			this.setTitle()
			this.utils.log.error( e instanceof Error ? e.message : e )
			this.utils.exitWithError()
			return

		}

	}

}
