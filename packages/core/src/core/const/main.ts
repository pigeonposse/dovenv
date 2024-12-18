import { validate } from '@dovenv/utils'

import { Command } from '../../_shared/cmd'

import type { ArgvParsed } from '../../_shared/types'

type ConstValue = string | number | boolean | Record<string, unknown>

export type ConstConfig = Record<string, ConstValue | ( () => Promise<ConstValue> )>

const ConstValueSchema = validate.union( [
	validate.string(),
	validate.number(),
	validate.boolean(),
	validate.record( validate.string(), validate.unknown() ),
] )

const ConstConfigSchema = validate.record(
	validate.string(),
	validate.union( [
		ConstValueSchema,
		validate.function()
			.returns( validate.promise( ConstValueSchema ) ),
	] ),
)

export class Constant extends Command<ConstConfig> {

	argv
	schema = ConstConfigSchema
	title = 'const'

	constructor(  argv? : ArgvParsed ) {

		super( argv?.config?.const, argv?.config )
		this.argv = argv

	}

	async #getValue( key: unknown ) {

		if ( !( this.opts && typeof key === 'string' && key in this.opts ) ) return

		const value = this.opts[key]

		if ( typeof value === 'function' ) {

			const [ e, result ] = await this.catchError( value() )

			if ( !e ) return result

			this.log.error( e )
			this.process.exit( )

		}
		else return value

	}

	async #view( props: ConstConfig ) {

		const avaliableKeys = Object.keys( props )

		const set = async ( key: string ) => {

			const value = await this.#getValue( key )

			if ( value )  {

				console.log( '\n' + this.style.info.h1( key ) )
				console.dir( value, {
					depth  : Infinity,
					colors : true,
				} )

			}

		}

		const keys: string[] = ( this.argv && this.argv.opts && 'key' in this.argv.opts && Array.isArray( this.argv.opts.key ) )
			? Object.values( this.argv.opts.key )
			: avaliableKeys

		const userKeys = this.getKeys( {
			values  : avaliableKeys,
			pattern : keys,
		} )

		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys ) {

			await set( key )

		}

	}

	async get(): Promise< Record<string, unknown>> {

		if ( !this.opts ) return {}

		await this.validateSchema( this.opts )

		const entries = await Promise.all( Object.entries( this.opts ).map(
			async  ( [ key ] ) => [ key, await this.#getValue( key ) ],
		) )

		const res = Object.fromEntries( entries )
		return res

	}

	async #fn() {

		if ( !( await this.ensureOpts() ) ) return

		await this.validateSchema( this.opts )
		await this.#view( this.opts || {} )

	}

	async run( ) {

		return await this.catchFn( this.#fn( ) )

	}

}
