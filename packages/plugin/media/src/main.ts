
import { CodeImage }   from './code-image'
import { ImageMin }    from './min'
import { QRcode }      from './qr'
import { TerminalGif } from './terminal-gif'

import type { CodeImageConfig }        from './code-image'
import type { ImageMinConfig }         from './min'
import type { QRcodeOpts }             from './qr'
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
	[CMDS.qr]?        : QRcodeOpts
	/** Configuration for create code images */
	[CMDS.codeImage]? : CodeImageConfig
	/** Configuration for minify images */
	[CMDS.min]?       : ImageMinConfig
	/** Configuration for create gifs of your terminal */
	[CMDS.termGif]?   : TermGifConfig
}

/**
 * A plugin for dovenv to handle media tasks.
 *
 * @param   {Config}       [conf] - The configuration object.
 * @returns {DovenvConfig}        - The plugin.
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
export const mediaPlugin = ( conf?: Config ) => {

	const data: DovenvConfig = { custom : { media : {
		desc : 'Media Tools for your workspace',
		cmds : {
			[CMDS.codeImage] : { desc: 'Generate code image' },
			[CMDS.min]       : { desc: 'Minify images' },
			[CMDS.qr]        : {
				desc : 'Generate QR code in terminal',
				opts : {
					input : {
						desc  : 'Input to generate QR code',
						alias : 'i',
						type  : 'string',
					// demandOption : true,
					},
					size : {
						desc    : 'Set QR small in screen',
						choices : [ 'medium', 'large' ],
					},
				},
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
			opts, cmds, showHelp, utils,
		} ) => {

			let userKeys = opts?.key as string[] | undefined

			if ( cmds?.includes( CMDS.codeImage ) ) {

				const ci = new CodeImage( CMDS.codeImage, conf?.[CMDS.codeImage], utils )
				await ci.run( userKeys )

			}
			else if ( cmds?.includes( CMDS.min ) ) {

				const ci = new ImageMin( CMDS.min, conf?.[CMDS.min], utils )
				await ci.run( userKeys )

			}
			else if ( cmds?.includes( CMDS.qr ) ) {

				const qr = new QRcode( CMDS.qr, conf?.[CMDS.qr], utils )
				if ( opts?.input ) {

					if ( !userKeys ) userKeys = []
					if ( !qr.opts ) qr.opts = {}
					userKeys.push( 'cli' )
					qr.opts['cli'] =  {
						input : opts.input as string,
						size  : opts?.size && [ 'medium', 'large' ].includes( opts.size as string ) ? opts.size as ( 'medium' | 'large' ) : undefined,
					}

				}
				await qr.run( userKeys )

			}
			else if ( cmds?.includes( CMDS.termGif ) ) {

				const ins = new TerminalGif( CMDS.termGif, conf?.[CMDS.termGif], utils )

				if ( cmds?.includes( 'config' ) ) await ins.createConfig()
				else if ( cmds?.includes( 'record' ) ) await ins.run( userKeys, 'record' )
				else if ( cmds?.includes( 'render' ) ) await ins.run( userKeys, 'render' )
				else showHelp( )

			}
			else showHelp( )

		},
	} } }

	return data

}

export default mediaPlugin
