/* eslint-disable jsdoc/require-jsdoc */
import { Resvg } from '@resvg/resvg-js'
import Jimp      from 'jimp-compact'
import http      from 'node:http'
import https     from 'node:https'

import { readFile } from '../../sys/main'

import type { ResvgRenderOptions } from '@resvg/resvg-js'

interface Svg2ImgOptions {
	format?  : 'png' | 'jpeg' | 'jpg'
	quality? : number
	resvg?   : ResvgRenderOptions
}

type Svg2ImgCallback = ( error: Error | null, result?: Buffer ) => void

/**
 * Main method
 * @param  {string | Buffer} svg - A SVG string, Buffer or a base64 string starting with "data:image/svg+xml;base64", or a file URL (http or local)
 * @param  {Svg2ImgOptions} [options] - options
 * @param  {Svg2ImgCallback} callback - result callback, 2 parameters: error, and result image buffer
 */
export async function svg2img( svg: string | Buffer, options: Svg2ImgOptions | Svg2ImgCallback, callback?: Svg2ImgCallback ): Promise<void> {

	if ( isFunction( options ) ) {

		// @ts-ignore
		callback = options
		options  = {}

	}

	if ( !callback ) {

		throw new Error( 'Callback function is required' )

	}

	loadSVGContent( svg, async ( error, content ) => {

		if ( error ) {

			callback( error )
			return

		}

		options         = options as Svg2ImgOptions
		options.resvg   = options.resvg || {}
		options.quality = options.quality ? parseInt( options.quality.toString(), 10 ) : 75
		options.format  = options.format ? options.format.toLowerCase() as 'png' | 'jpeg' | 'jpg' : 'png'

		const isJpg = options.format === 'jpg' || options.format === 'jpeg'

		try {

			if ( isJpg ) options.resvg.background = '#fff'
			// @ts-ignore
			const resvg   = new Resvg( content, options.resvg )
			const pngData = resvg.render()

			let imgBuffer: Buffer
			if ( isJpg ) {

				const pngBuffer = pngData.asPng()
				const image     = await Jimp.read( pngBuffer )
				await image.quality( options.quality )
				imgBuffer = await image.getBufferAsync( Jimp.MIME_JPEG )

			}
			else {

				imgBuffer = pngData.asPng()

			}

			callback( null, imgBuffer )

		}
		catch ( error ) {

			callback( error as Error )

		}

	} )

}

function loadSVGContent( svg: string | Buffer, callback: ( error: Error | null, content?: string | Buffer ) => void ): void {

	if ( typeof svg === 'string' && svg.startsWith( 'data:image/svg+xml;base64,' ) ) {

		const base64Data  = svg.substring( 'data:image/svg+xml;base64,'.length )
		const decodedData = Buffer.from( base64Data, 'base64' ).toString( 'utf-8' )
		callback( null, decodedData )

	}
	else if ( typeof svg === 'string' && svg.startsWith( '<svg' ) ) {

		callback( null, svg )

	}
	else {

		const loader = typeof svg === 'string' && svg.startsWith( 'http' ) ? loadRemoteImage : readFile
		// @ts-ignore
		loader( svg as string )
			// @ts-ignore
			// eslint-disable-next-line promise/no-callback-in-promise
			.then( data => callback( null, Buffer.isBuffer( data ) ? data.toString( 'utf-8' ) : data ) )
			// eslint-disable-next-line promise/no-callback-in-promise
			.catch( callback )

	}

}

function loadRemoteImage( url: string, onComplete: ( error: Error | null, data?: Buffer ) => void ): void {

	const protocol = url.startsWith( 'https' ) ? https : http
	protocol.get( url, res => {

		const data: Buffer[] = []
		res.on( 'data', chunk => data.push( chunk ) )
		res.on( 'end', () => onComplete( null, Buffer.concat( data ) ) )

	} ).on( 'error', onComplete )

}

function isFunction( func: unknown ):  boolean {

	return typeof func === 'function'

}
