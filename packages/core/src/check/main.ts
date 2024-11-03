/* eslint-disable @stylistic/object-curly-newline */
import {
	getPaths,
	validate,
	readFile,
} from '@dovenv/utils'

import { Command }      from '../_shared/cmd'
import { objectFilter } from '../_shared/utils'

import type { ArgvParsed } from '../_shared/types'

const TYPE = {
	DIR  : 'dir',
	FILE : 'file',
} as const

export type CheckConfig = Record<string,
	{
		/** Type of check */
		type         : typeof TYPE.DIR
		/** Description of your check */
		desc?        : string
		/** Glob patterns of dirs for check */
		patterns     : string[]
		/** Validation function for all dirs */
		validateAll? : ( data: {
			/** Paths of the dirs */
			paths : string[]
		} ) => Promise<void>
		/** Validation function called every time a dir path is read */
		validate?    : ( data: {
			/** Path of the dir */
			path : string
		} ) => Promise<void>
	} |
	{
		/** Type of check */
		type         : typeof TYPE.FILE
		/** Description of your check */
		desc?        : string
		/** Glob patterns of files for check */
		patterns     : string[]
		/** Validation function for all dirs */
		validateAll? : ( data: {
			/** Paths of the files */
			paths : string[]
		} ) => Promise<void>
		/**
		 * Validation function. It is called every time a file path is read.
		 * @example
		 * const validate = async ( {path, content} ) => {
		 *   if ( !content ) throw new Error(`File [${path}] must exist`)
		 *   else if( content === '' ) throw new Error(`File [${path}] is empty and must have content`)
		 * }
		 */
		validate? : ( data: {
			/** Path of the file */
			path     : string
			/** Content of the file */
			content? : string
		} ) => Promise<void>
	}
>

export class Check extends Command {

	props
	argv
	load

	schema = validate.record(
		validate.string(),
		validate.object( {
			desc        : validate.string().optional(),
			type        : validate.literal( TYPE.FILE ),
			patterns    : validate.array( validate.string() ).nonempty(),
			validateAll : validate.function()
				.args( validate.object( { paths: validate.array( validate.string() ) } ) )
				.returns( validate.promise( validate.void() ) )
				.optional(),
			validate : validate.function()
				.args( validate.object( {
					path    : validate.string(),
					content : validate.string().optional(),
				} ) )
				.returns( validate.promise( validate.void() ) )
				.optional(),
		} ).strict().or(
			validate.object( {
				desc        : validate.string().optional(),
				type        : validate.literal( TYPE.DIR ),
				patterns    : validate.array( validate.string() ).nonempty(),
				validateAll : validate.function()
					.args( validate.object( { paths: validate.array( validate.string() ) } ) )
					.returns( validate.promise( validate.void() ) )
					.optional(),
				validate : validate.function()
					.args( validate.object( { path: validate.string() } ) )
					.returns( validate.promise( validate.void() ) )
					.optional(),
			} ).strict(),
		),
	).optional()

	constructor( argv? : ArgvParsed ) {

		super()

		// @ts-ignore
		this.props = ( argv?.config?.check || undefined ) as CheckConfig
		this.argv  = argv
		this.load  = this.spinner()

	}

	async #validateWrap( fn: Promise<void>, key: string ) {

		try {

			return await fn

		}
		catch ( e ) {

			this.load.fail( this.setContentString( key, ( e instanceof Error ? e.message : JSON.stringify( e ) ), 'red' ) )
			// this.load.fail( `${color.red( `${key}:` )} ` + ( e instanceof Error ? e.message : JSON.stringify( e ) ) )
			this.process.exit()

		}

	}

	async #dirs( props: CheckConfig ) {

		if ( !props || Object.keys( props ).length === 0  ) return

		this.setSection( 'Checking dirs' )

		const dirs     = objectFilter( props, ( { type } ) => type === TYPE.DIR )
		const userKeys = this.getKeysFromArgv( Object.keys( dirs ), this.argv )

		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys  ) {

			const prop  = dirs[key]
			const paths = await getPaths( prop.patterns, { onlyDirectories: true } )

			this.load.start( this.setContentString( key, prop.desc, 'cyan' ) )

			if ( !prop.validateAll && !prop.validate ) {

				this.load.warn( this.setContentString( key, 'Skipped because no validate function exists', 'yellow' ) )
				continue

			}
			if ( prop.validateAll ) await this.#validateWrap( prop.validateAll( { paths } ), key )
			if ( prop.validate ) {

				for ( const path of paths ) {

					await this.#validateWrap( prop.validate( { path } ), key )

				}

			}
			this.load.succeed( this.setContentString( key, prop.desc, 'green' ) )

		}

	}

	async #files( props: CheckConfig ) {

		if ( !props || Object.keys( props ).length === 0  ) return

		this.setSection( 'Checking files' )

		const files    = objectFilter( props, ( { type } ) => type === TYPE.FILE )
		const userKeys = this.getKeysFromArgv( Object.keys( files ), this.argv )

		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys  ) {

			const prop = files[key]

			const paths = await getPaths( prop.patterns, { onlyFiles: true } )

			this.load.start( this.setContentString( key, prop.desc, 'cyan' ) )

			if ( !prop.validateAll && !prop.validate ) {

				this.load.warn( this.setContentString( key, ' Skipped because no validate function exists', 'yellow' ) )
				continue

			}
			if ( prop.validateAll ) await this.#validateWrap( prop.validateAll( { paths } ), key )
			if ( prop.validate ) {

				for ( const path of paths ) {

					const content = await readFile( path )
					await this.#validateWrap( prop.validate( {
						path,
						content : content.toString(),
					} ), key )

				}

			}

			this.load.succeed( this.setContentString( key, prop.desc, 'green' ) )

		}

	}

	async run() {

		if ( !this.props ) {

			this.log.info( 'Nothing to check' )
			return

		}
		this.validateSchema( this.props )
		if ( this.argv?.cmds?.includes( TYPE.DIR ) )
			await this.#dirs( this.props )
		else if ( this.argv?.cmds?.includes( TYPE.FILE ) )
			await this.#files( this.props )
		else {

			await this.#dirs( this.props )
			console.log()
			await this.#files( this.props )

		}

	}

}
