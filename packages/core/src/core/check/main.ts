/* eslint-disable @stylistic/object-curly-newline */
import {
	validate,
	readFile,
} from '@dovenv/utils'

import { Command } from '../../_shared/cmd'

import type {
	ArgvParsed,
	Response,
} from '../../_shared/types'
import type { Prettify } from '@dovenv/utils'

const TYPE = {
	DIR    : 'dir',
	FILE   : 'file',
	CUSTOM : 'custom',
} as const

type CheckType = typeof TYPE[keyof typeof TYPE]
type CheckShared = {
	/** Description of your check */
	desc? : string
}
type CheckDir = CheckShared & {
	/** Glob patterns of dirs for check */
	patterns     : string[]
	/** Validation function for all dirs */
	validateAll? : ( data: {
		/** Paths of the dirs */
		paths  : string[]
		/** Dovenv config */
		config : ArgvParsed['config']
	} ) => Response<void>
	/** Validation function called every time a dir path is read */
	validate?    : ( data: {
		/** Path of the dir */
		path   : string
		/** Dovenv config */
		config : ArgvParsed['config']
	} ) => Response<void>
}

type CheckFile = CheckShared & {
	/** Glob patterns of files for check */
	patterns     : string[]
	/** Validation function for all dirs */
	validateAll? : ( data: {
		/** Paths of the files */
		paths  : string[]
		/** Dovenv config */
		config : ArgvParsed['config']
	} ) => Response<void>
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
		/** Dovenv config */
		config   : ArgvParsed['config']
	} ) => Response<void>
}
type CheckCustom = CheckShared & {
	fn: ( data: {
		config : ArgvParsed['config']
		run: {
			file : Check['file']
			dir  : Check['dir']
		}
	} ) => Promise<void>
}
type CheckConfigValue<T extends CheckType, V extends object> = {
	/** Type of check */
	type : T
} & V
export type CheckConfig = Prettify<Record<string,
	CheckConfigValue< typeof TYPE.FILE, CheckFile>
	| CheckConfigValue< typeof TYPE.DIR, CheckDir>
	| CheckConfigValue< typeof TYPE.CUSTOM, CheckCustom>
>>

export class Check extends Command<CheckConfig> {

	title = 'check'
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
		).or( validate.object( {
			desc : validate.string().optional(),
			type : validate.literal( TYPE.CUSTOM ),
			fn   : validate.function(),
		} ).strict(),
		),
	).optional()

	constructor( argv? : ArgvParsed ) {

		super( argv?.config?.check, argv?.config )

		this.argv = argv
		this.load = this.spinner()

	}

	async #validateWrap( fn: Promise<void> | void ) {

		try {

			return await fn

		}
		catch ( e ) {

			this.load.fail( this.style.error.msg( ( e instanceof Error ? e.message : JSON.stringify( e ) ) ) )
			// this.load.fail( `${color.red( `${key}:` )} ` + ( e instanceof Error ? e.message : JSON.stringify( e ) ) )
			this.exitWithError()

		}

	}

	async file( prop: CheckFile ) {

		const paths = ( await this.getPaths( prop.patterns, {
			onlyFiles : true,
		} ) )

		if ( !paths.length ) {

			this.load.warn( this.style.warn.msg( 'No files matched the patterns' ) )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			this.load.warn( this.style.warn.msg(  'Skipped because no validate function exists' ) )
			return

		}

		if ( prop.validateAll )
			await this.#validateWrap( prop.validateAll( {
				paths,
				config : this.config || {},
			} ) )

		if ( prop.validate ) {

			for ( const path of paths ) {

				const content = await readFile( path )
				await this.#validateWrap(
					prop.validate( {
						path,
						content : content.toString(),
						config  : this.config || {},
					} ),
				)

			}

		}
		this.load.succeed( this.style.success.msg( 'All file checks passed' ) )

	}

	async dir( prop: CheckDir ) {

		const paths = ( await this.getPaths( prop.patterns, {
			onlyDirectories : true,
		} ) )

		const config = this.config || {}

		if ( !paths.length ) {

			this.load.warn( this.style.warn.msg( 'No directories matched the patterns' ) )
			return

		}
		if ( !prop.validateAll && !prop.validate ) {

			this.load.warn( this.style.warn.msg( 'Skipped because no validate function exists' ) )
			return

		}
		if ( prop.validateAll )
			await this.#validateWrap( prop.validateAll( {
				paths,
				config,
			} ) )

		if ( prop.validate ) {

			for ( const path of paths ) {

				await this.#validateWrap( prop.validate( {
					path,
					config,
				} ) )

			}

		}
		this.load.succeed( this.style.success.msg( 'All directory checks passed' ) )

	}

	async custom( prop: CheckCustom ) {

		await this.#validateWrap( prop.fn( {
			config : this.config,
			run    : {
				dir  : this.dir.bind( this ),
				file : this.file.bind( this ),
			},
		} ) )
		this.load.succeed( this.style.success.msg( 'Check function succesfully passed' ) )

	}

	async multiple( props: CheckConfig ) {

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )
		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys  ) {

			const prop = props[key]

			console.log(
				this.style.info.h1( key ),
				this.style.info.b( `(${prop.type})` ),
				prop.desc ? this.style.info.p( prop.desc ) : '',
			)

			if ( prop.type === TYPE.DIR )
				await this.dir( prop )
			else if ( prop.type === TYPE.FILE )
				await this.file( prop  )
			else if ( prop.type === TYPE.CUSTOM )
				await this.custom( prop )
			else console.warn( this.style.warn.p( `Unexpected or not provided type in ${this.style.badge( key )}` ) )
			console.log()

		}

	}

	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		const opts = this.opts || {}
		await this.validateSchema( opts )

		await this.multiple( opts )

	}

	async run() {

		return await this.catchFn( this.#fn( ) )

	}

}
