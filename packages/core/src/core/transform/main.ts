
import {
	validate,
	readFile,
	getPaths,
	writeFileContent,
} from '@dovenv/utils'

import { Command } from '../../_shared/cmd'

import type { ArgvParsed } from '../../_shared/types'

type Const = NonNullable<ArgvParsed['config']>['const']
export type TransformConfig = Record<string, {
	input : string[]
	fn : ( data: {
		/** Paths of the dirs */
		path    : string
		/** Content of the file */
		content : string
		/** Constants of the workspace */
		const   : Const
	} ) => Promise<string | undefined>
}>

export class Transform extends Command<TransformConfig> {

	argv
	load
	title = 'transform'

	schema = validate.record(
		validate.string(),
		validate.object( {
			input : validate.array( validate.string() ).nonempty(),
			fn    : validate.function()
				.args( validate.object( {
					path    : validate.string(),
					content : validate.string().optional(),
					const   : validate.record( validate.string(), validate.unknown() ).optional(),
				} ) )
				.returns( validate.promise( validate.string().optional() ) )
				.optional(),
		} ).strict(),
	)

	constructor( argv? : ArgvParsed ) {

		super( argv?.config?.transform, argv?.config )

		this.argv = argv
		this.load = this.spinner()

	}

	async #set() {

		const constants = this.argv?.config?.const ? this.argv?.config?.const : {}

		const props = this.opts || {}

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )
		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys ) {

			this.load.start( this.style.info.msg( key, 'Transforming...' ) )

			try {

				const prop = props[key]

				if ( !prop.input ) throw new Error( `No input for ${key}` )
				const inputs = await getPaths( prop.input, { onlyFiles: true } )
				for ( const i of inputs ) {

					const content = await readFile( i, 'utf8' )
					if ( !prop.fn ) continue

					const newContent = await prop.fn( {
						path    : i,
						content : content,
						const   : constants,
					} )
					if ( !newContent ) continue
					await writeFileContent( i, newContent )
					this.load.text = this.style.info.msg( key, `[${i}] successfully transformed` )

				}
				this.load.succeed( this.style.success.msg( key, 'Inputs successfully transformed' ) )

			}
			catch ( e ) {

				this.load.fail( this.style.error.msg( key, 'Transformation failed. ' +  ( e instanceof Error ? e.message : JSON.stringify( e ) ) ) )
				//this.log.fatal( e )
				this.process.exit()

			}

		}

	}

	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		await this.validateSchema( this.opts )
		await this.#set()

	}

	async run( ) {

		return await this.catchFn( this.#fn( ) )

	}

}
