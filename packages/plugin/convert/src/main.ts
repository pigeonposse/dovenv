
import {
	color,
	getMatch,
} from '@dovenv/utils'

import {
	Convert,
	methods,
} from './run'

import type { ConvertConfig }           from './run'
import type { ObjectValues }            from '@dovenv/utils'
import type { Config as DoveEnvConfig } from 'dovenv'

type Config = { [key in string]: ConvertConfig }

const CMD = methods

export const config = ( conf?: Config ): DoveEnvConfig => {

	return { custom : { convert : {
		desc : 'Convert files from one format to another',
		// cmds : {
		// 	[CMD.ts2md]      : { desc: 'Convert files from typescript to md' },
		// 	[CMD.jsdoc2md]   : { desc: 'Convert files from jsdoc to md' },
		// 	[CMD.html2md]    : { desc: 'Convert files from html to md' },
		// 	[CMD.md2html]    : { desc: 'Convert files from md to html' },
		// 	[CMD.openapi2md] : { desc: 'Convert files from openapi to md' },
		// },
		opts : { key : {
			alias : 'k',
			desc  : 'Key value',
			type  : 'string',
		} },
		fn : async ( {
			cmds, opts, showHelp,
		} ) => {

			const convert  = new Convert( )
			const deftKeys = conf ? Object.keys( conf ) : []
			const userKeys = opts?.key as string[] | undefined
			const getKeys  = ( avaliableKeys: string[], userkeyPattern?:  string[] ) => {

				const keys: string[] = userkeyPattern ? userkeyPattern : avaliableKeys

				const userKeys = getMatch( avaliableKeys, keys )
				if ( !userKeys.length ) return undefined
				return userKeys

			}
			const setFn = async ( keys: string[], cmd: ObjectValues<typeof CMD> ) => {

				if ( !conf ) return
				for ( const key of keys ) {

					console.log( `Converting: [${key}]` )

					const props = conf[key]
					await convert[cmd]( props )
					console.log( `Converted: [${key}]` )

				}

			}
			const keys = getKeys( deftKeys, userKeys )
			// console.log( {
			// 	deftKeys,
			// 	userKeys,
			// 	keys,
			// } )
			if ( !conf ) {

				console.warn( 'No config provided for conversion' )
				return

			}
			if ( !keys ) {

				console.warn( `keys provided does not exist. Available keys: ${color.italic.dim( deftKeys.join( ', ' ) )}` )
				return

			}

			if ( cmds?.includes( CMD.ts2md ) ) await setFn( keys, CMD.ts2md )
			else if ( cmds?.includes( CMD.jsdoc2md ) ) await setFn( keys, CMD.jsdoc2md )
			else if ( cmds?.includes( CMD.html2md ) ) await setFn( keys, CMD.html2md )
			else if ( cmds?.includes( CMD.md2html ) ) await setFn( keys, CMD.md2html )
			else if ( cmds?.includes( CMD.openapi2md ) ) await setFn( keys, CMD.openapi2md )
			else showHelp()

		},
	} } }

}

