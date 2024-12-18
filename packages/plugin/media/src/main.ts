
import {
	color,
	getMatch,
} from '@dovenv/core/utils'

import { generateCodeImage } from './code-image'
import { runImageMin }       from './min'
import { generateQR }        from './qr'
import {
	terminalGif,
	terminalGifCreateConfg,
} from './terminal-gif'

import type { CodeImageConfig }        from './code-image'
import type { ImageMinConfig }         from './min'
import type { TermGifConfig }          from './terminal-gif'
import type { Config as DovenvConfig } from '@dovenv/core'

const CMDS = {
	codeImage : 'codeimage',
	min       : 'min',
	qr        : 'qr',
	termGif   : 'termgif',
} as const

type Config = {
	/** Configuration for create code images */
	[CMDS.codeImage]? : { [key: string]: CodeImageConfig }
	/** Configuration for minify images */
	[CMDS.min]?       : { [key: string]: ImageMinConfig }
	/** Configuration for create gifs of your terminal */
	[CMDS.termGif]?   : { [key: string]: TermGifConfig }
}

const getKeys = ( avaliableKeys: string[], userkeyPattern?:  string[] ) => {

	const keys: string[] = userkeyPattern ? userkeyPattern : avaliableKeys

	const userKeys = getMatch( avaliableKeys, keys )
	if ( !userKeys.length ) return undefined
	return userKeys

}

/**
 * A plugin for dovenv to handle media tasks.
 * @param {Config} [conf] - The configuration object.
 * @returns {DovenvConfig} - The plugin.
 * @example
 * import { defineConfig } from '@dovenv/core'
 * import { mediaPlugin } from '@dovenv/media'
 * export default defineConfig(
 *     mediaPlugin( {
 *         codeimage: {
 *             example1: {
 *                 type: 'code',
 *                 input: 'examples/recourses/main.js',
 *                 output: 'build/code',
 *             },
 *             example2: {
 *                 type: 'code',
 *                 input: 'examples/recourses/main.ts',
 *                 output: 'build/ts',
 *             },
 *         },
 *         min: {
 *             example1: {
 *                 type: 'min',
 *                 input: 'examples/recourses/main.png',
 *                 output: 'build/images',
 *             },
 *         },
 *     } ),
 * )
 */
export const mediaPlugin = ( conf?:  Config ) => {

	const data: DovenvConfig = { custom : { media : {
		desc : 'Media Tools for your workspace',
		cmds : {
			[CMDS.codeImage] : { desc: 'Generate code image' },
			[CMDS.min]       : { desc: 'Minify images' },
			[CMDS.qr]        : {
				desc : 'Generate QR code in terminal',
				opts : { input : {
					desc         : 'Input to generate QR code',
					alias        : 'i',
					type         : 'string',
					demandOption : true,
				} },
			},
			[CMDS.termGif] : {
				desc : 'Create gifs of your terminal',
				cmds : {
					config : { desc: 'Create a configuration file for your record' },
					record : { desc: 'Record your terminal' },
					render : { desc: 'Convert to gif' },
				},
				examples : [
					{
						cmd  : `$0 media ${CMDS.termGif} config`,
						desc : 'Create configuration file',
					},
					{
						cmd  : `$0 media ${CMDS.termGif} record -k <ID>`,
						desc : 'Record your terminal',
					},
					{
						cmd  : `$0 media ${CMDS.termGif} render -k <ID>`,
						desc : 'Convert your term recording into a gif',
					},
				],
			},
		},
		opts : { key : {
			type  : 'array',
			alias : 'k',
			desc  : 'pattern to match keys in configuration',
		} },
		fn : async ( {
			opts, cmds, showHelp,
		} ) => {

			const userKeys = opts?.keys as string[] | undefined

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
					else showHelp()

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
				else showHelp()

			}
			else showHelp( )
			// throw new Error( 'Unexpected command provided. Use "code-image"' )

		},
	} } }

	return data

}

export default mediaPlugin
