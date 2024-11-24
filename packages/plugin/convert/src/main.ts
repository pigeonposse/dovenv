
import {
	color,
	getMatch,
} from '@dovenv/utils'

import { Convert } from './run'

import type { ConfigValue }             from './run'
import type { Config as DoveEnvConfig } from '@dovenv/core'

export * from './run'

type Config = { [key in string]: ConfigValue }

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { convert : {
		desc : 'Convert files from one format to another (experimental)',
		opts : { key : {
			alias : 'k',
			desc  : 'Key pattern to convert',
			type  : 'array',
		} },
		fn : async ( { opts } ) => {

			const convert  = new Convert( )
			const deftKeys = conf ? Object.keys( conf ) : []
			const userKeys = opts?.key as string[] | undefined
			const getKeys  = ( avaliableKeys: string[], userkeyPattern?:  string[] ) => {

				const keys: string[] = userkeyPattern ? userkeyPattern : avaliableKeys

				const userKeys = getMatch( avaliableKeys, keys )
				if ( !userKeys.length ) return undefined
				return userKeys

			}

			const keys = getKeys( deftKeys, userKeys )

			if ( !conf ) {

				console.warn( 'No config provided for conversion' )
				return

			}
			if ( !keys ) {

				console.warn( `keys provided does not exist. Available keys: ${color.italic.dim( deftKeys.join( ', ' ) )}` )
				return

			}

			for ( const key of keys ) {

				console.info( `Key: [${key}]` )

				const props = conf[key]
				const {
					type,
					...restProps
				} = props

				console.debug( { props } )

				// @ts-ignore
				await convert[type]( restProps )

			}

		},
	} } }

}

