import {
	color,
	validate,
} from '@dovenv/utils'

import { Command } from '../_shared/cmd'

import type { ArgvParsed } from '../_shared/types'

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

export class Constant extends Command {

	props
	argv
	schema = ConstConfigSchema

	constructor(  argv? : ArgvParsed ) {

		super()
		this.argv = argv
		// @ts-ignore
		this.props = ( argv?.config?.const || undefined ) as ConstConfig

	}

	async #getValue( key: unknown ) {

		if ( !( this.props && typeof key === 'string' && key in this.props ) ) return

		const value = this.props[key]

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

				this.log.info( color.cyan( `[${key}]` ) )
				console.dir( value, {
					depth  : Infinity,
					colors : true,
				} )

			}

		}

		const keys: string[] = ( this.argv && this.argv.opts && 'key' in this.argv.opts && Array.isArray( this.argv.opts.key ) )
			? Object.values( this.argv.opts.key )
			: avaliableKeys

		const userKeys = this.getKeys( avaliableKeys, keys )

		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys ) {

			await set( key )

		}

	}

	async get(): Promise< Record<string, unknown>> {

		if ( !this.props ) return {}

		this.validateSchema( this.props )

		const entries = await Promise.all( Object.entries( this.props ).map(
			async  ( [ key ] ) => [ key, await this.#getValue( key ) ],
		) )

		const res = Object.fromEntries( entries )
		return res

	}

	async run( ) {

		if ( !this.props ) {

			this.log.info( 'Nothing to show' )
			return

		}

		this.validateSchema( this.props )
		await this.#view( this.props )

	}

}
