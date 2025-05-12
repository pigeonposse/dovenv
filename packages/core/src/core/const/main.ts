
import { schema }      from './schema'
import { ConstConfig } from './types'
import { Command }     from '../_shared/main'

import type { ArgvParsed } from '../../_shared/types'

export class Constant extends Command<ConstConfig> {

	argv

	constructor( argv : ArgvParsed ) {

		super( argv.utils.config?.const, argv.utils )

		this.argv        = argv
		this.utils.title = 'const'
		this.schema      = schema( this.utils.validate )

	}

	async #getValue( key: unknown ) {

		if ( !( this.opts && typeof key === 'string' && key in this.opts ) ) return

		const value = this.opts[key]

		if ( typeof value === 'function' ) {

			const [ e, result ] = await this.catchError( ( async () => await value() )() )

			if ( !e ) return result
			return 'Error setting value of ' + key + ':\n' + e.message

		}
		else return value

	}

	async #view( props: ConstConfig ) {

		const avaliableKeys = Object.keys( props )

		const set = async ( key: string ) => {

			const value = await this.#getValue( key )

			if ( value ) {

				console.log( '\n' + this.utils.style.info.h1( key ) )
				console.dir( value, {
					depth  : Infinity,
					colors : true,
				} )

			}

		}

		const keys: string[] = ( this.argv && this.argv.opts && 'key' in this.argv.opts && Array.isArray( this.argv.opts.key ) )
			? Object.values( this.argv.opts.key )
			: avaliableKeys

		const userKeys =  this.utils.getKeys( {
			input   : avaliableKeys,
			pattern : keys,
		} )

		if ( !userKeys || !userKeys.length ) return

		for ( const key of userKeys ) {

			await set( key )

		}

	}

	async get(): Promise<Record<string, unknown>> {

		if ( !this.opts ) return {}

		await this.validateSchema( this.opts )

		const entries = await Promise.all( Object.entries( this.opts ).map(
			async ( [ key ] ) => [ key, await this.#getValue( key ) ],
		) )

		const res = Object.fromEntries( entries )
		return res

	}

	async #fn() {

		if ( !( await this.utils.ensureOpts( { input: this.opts } ) ) ) return

		await this.validateSchema( this.opts )
		await this.#view( this.opts || {} )

	}

	async run( ) {

		return await this.utils.catchFn( this.#fn( ) )

	}

}
