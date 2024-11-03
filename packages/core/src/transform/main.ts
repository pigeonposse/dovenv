
import {
	validate,
	readFile,
	getPaths,
	writeFileContent,
} from '@dovenv/utils'

import { Command } from '../_shared/cmd'

import type { ArgvParsed } from '../_shared/types'
import type { Constant }   from '../const/main'

export type TransformConfig = Record<string, {
	input : string[]
	fn : ( data: {
		/** Paths of the dirs */
		path    : string
		/** Content of the file */
		content : string
		/** Constants of the workspace */
		const   : Record<string, unknown>
	} ) => Promise<string | undefined>
}>

export class Transform extends Command {

	props
	constInstance
	argv
	load

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

	constructor(  argv? : ArgvParsed, constant?: Constant ) {

		super()
		this.constInstance = constant
		// @ts-ignore
		this.props = ( argv?.config?.transform || undefined ) as TransformConfig
		this.argv  = argv
		this.load  = this.spinner()

	}

	async #set() {

		const constants = this.constInstance ? await this.constInstance.get() : {}

		const props = this.props
		if ( !props || Object.keys( props ).length === 0  ) return

		const userKeys = this.getKeysFromArgv( Object.keys( props ), this.argv )

		if ( !userKeys || !userKeys.length ) return
		for ( const key of userKeys ) {

			this.load.start( this.setContentString( key, 'Transforming...', 'cyan' ) )

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
					this.load.text = this.setContentString( key, `[${i}] successfully transformed`, 'cyan' )

				}
				this.load.succeed( this.setContentString( key, 'Inputs successfully transformed', 'green' ) )

			}
			catch ( e ) {

				this.load.fail( this.setContentString( key, 'Transformation failed. ' +  ( e instanceof Error ? e.message : JSON.stringify( e ) ), 'red' ) )
				//this.log.fatal( e )
				this.process.exit()

			}

		}

	}

	async run( ) {

		if ( !this.props ) return

		this.validateSchema( this.props )
		await this.#set()

	}

}
