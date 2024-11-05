
import {
	color,
	getMatch,
} from '@dovenv/utils'

import { generateCodeImage } from './code-image'
import { runImageMin }       from './min'
import { generateQR }        from './qr'
import {
	terminalGif,
	terminalGifCreateConfg,
} from './terminal-gif'

import type { CodeImageConfig }         from './code-image'
import type { ImageMinConfig }          from './min'
import type { TermGifConfig }           from './terminal-gif'
import type { Config as DoveEnvConfig } from 'dovenv'

const CMDS = {
	codeImage : 'code-image',
	min       : 'min',
	qr        : 'qr',
	termGif   : 'termgif',
} as const
type Config = {
	[CMDS.codeImage]? : { [key: string]: CodeImageConfig }
	[CMDS.min]?       : { [key: string]: ImageMinConfig }
	[CMDS.termGif]?   : { [key: string]: TermGifConfig }
}

const getKeys = ( avaliableKeys: string[], userkeyPattern?:  string[] ) => {

	const keys: string[] = userkeyPattern ? userkeyPattern : avaliableKeys

	const userKeys = getMatch( avaliableKeys, keys )
	if ( !userKeys.length ) return undefined
	return userKeys

}

export const config = ( conf?:  Config ) => {

	const data: DoveEnvConfig = { custom : { media : {
		desc : 'Media functionality for your workspace',
		cmds : {
			[CMDS.codeImage] : { desc: 'Generate code image' },
			[CMDS.min]       : { desc: 'Minify images' },
			[CMDS.qr]        : {
				desc : 'Generate QR code in terminal',
				opts : { input : {
					alias        : 'i',
					type         : 'string',
					demandOption : true,
				} },
			},
			[CMDS.termGif] : { desc: 'Creaate gifs of your terminal' },
		},
		opts : { keys : {
			type  : 'array',
			alias : 'k',
			desc  : 'pattern to match keys in configuration',
		} },
		fn : async ( {
			opts, cmds,
		} ) => {

			const userKeys = opts?.keys as string[] | undefined
			const confKeys = Object.keys( CMDS )

			if ( cmds?.includes( CMDS.codeImage ) ) {

				const cmd = conf?.[CMDS.codeImage]
				if ( cmd && !userKeys ) {

					for ( const [ key, value ] of Object.entries( cmd ) ) {

						console.log( `Generating code image for ${key}` )
						await generateCodeImage( value )

					}

				}
				else if ( cmd && userKeys ) {

					const deftKeys = Object.keys( cmd )
					const keys     = getKeys( Object.keys( cmd ), userKeys )
					if ( !keys ) console.warn( `keys provided does not exist. Available keys: ${color.italic.dim( deftKeys.join( ', ' ) )}` )
					else {

						for ( const key of keys ) {

							console.log( `Generating code image for ${key}` )
							await generateCodeImage( cmd[key] )

						}

					}

				}
				else console.warn( 'No code image provided in your configuration' )

			}
			else if ( cmds?.includes( CMDS.min ) ) {

				const cmd = conf?.[CMDS.min]
				if ( cmd && !userKeys ) {

					for ( const [ key, value ] of Object.entries( cmd ) ) {

						console.log( `Minifying image [${key}]` )
						await runImageMin( value )

					}

				}
				else if ( cmd && userKeys ) {

					const deftKeys = Object.keys( cmd )
					const keys     = getKeys( Object.keys( cmd ), userKeys )
					if ( !keys ) console.warn( `keys provided does not exist. Available keys: ${color.italic.dim( deftKeys.join( ', ' ) )}` )
					else {

						for ( const key of keys ) {

							console.log( `Minifying image [${key}]` )
							await runImageMin( cmd[key] )

						}

					}

				}
				else console.warn( 'No code image provided in your configuration' )

			}
			else if ( cmds?.includes( CMDS.qr ) ) {

				if ( opts?.input )
					await generateQR( { input: opts.input as string } )
				else
					console.warn( 'No input provided. Use "--input|-i <input>"' )

			}
			else if ( cmds?.includes( CMDS.termGif ) ) {

				const cmd = conf?.[CMDS.termGif]
				const run = async ( key: string, value: TermGifConfig ) => {

					const termToGif = terminalGif( value )
					if ( cmds?.includes( 'record' ) ) {

						console.log( `Recording: [${key}]` )
						await termToGif.record(  )

					}
					else if ( cmds?.includes( 'render' ) ) {

						console.log( `Rendering: [${key}]` )
						await termToGif.render( )

					}
					// else if ( cmds?.includes( 'player' ) ) {

					// 	console.log( `Creating player: [${key}]` )
					// 	await termToGif.generatePlayer( )

					// }
					else console.warn( 'No command provided. Use "record" or "render"' )

				}

				if ( cmds?.includes( 'config' ) ) await terminalGifCreateConfg()
				else if ( cmds?.includes( 'record' ) || cmds?.includes( 'render' ) ) {

					// @ts-ignore
					//await terminalGif.record()

					if ( cmd && !userKeys ) {

						for ( const [ key, value ] of Object.entries( cmd ) ) {

							await run( key, value )

						}

					}
					else if ( cmd && userKeys ) {

						const deftKeys = Object.keys( cmd )
						const keys     = getKeys( Object.keys( cmd ), userKeys )
						if ( !keys ) console.warn( `keys provided does not exist. Available keys: ${color.italic.dim( deftKeys.join( ', ' ) )}` )
						else {

							for ( const key of keys ) {

								const value = cmd[key]
								await run( key, value )

							}

						}

					}
					else console.warn( 'No termgif configuration provided' )

				}
				else
					console.warn( `No subcommand provided. Use: ${color.dim.italic( 'init, config, generate, record' )}` )

			}
			else console.warn( `No command provided. Use: ${color.dim.italic( confKeys?.join( ', ' ) || '' )}` )
			// throw new Error( 'Unexpected command provided. Use "code-image"' )

		},
	} } }

	return data

}

