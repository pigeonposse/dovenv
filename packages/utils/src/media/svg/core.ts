/* eslint-disable jsdoc/require-jsdoc */
import { icon }   from '@fortawesome/fontawesome-svg-core'
import { Resvg }  from '@resvg/resvg-js'
import Jimp       from 'jimp-compact'
import { Buffer } from 'node:buffer'
import http       from 'node:http'
import https      from 'node:https'
import {
	parse,
	stringify,
} from 'svgson'

import { readFile }             from '../../sys/main'
import { _getMediaInputString } from '../_core/main'

import type { SvgProps }           from './types'
import type { ResvgRenderOptions } from '@resvg/resvg-js'
import type { INode }              from 'svgson'

export type Svg2ImgCoreProps = {
	/**
	 * Format of the image
	 * @default png
	 */
	format?        : 'png' | 'jpeg' | 'jpg'
	/**
	 * Quality of the image
	 * @default 75
	 */
	quality?       : number
	/**
	 * Resvg options
	 * @see https://github.com/thx/resvg-js
	 */
	resvg?         : ResvgRenderOptions
	/**
	 * Transform the SVG tree before rendering
	 * @see https://www.npmjs.com/package/svgson
	 */
	transformNode? : ( node: INode ) => Promise<INode> | INode
}

type Svg2ImgCallback = ( error: Error | null, result?: Buffer ) => void

/**
 * Main method
 * @param  {string | Buffer} svg - A SVG string, Buffer or a base64 string starting with "data:image/svg+xml;base64", or a file URL (http or local)
 * @param  {Svg2ImgCoreProps} [options] - options
 * @param  {Svg2ImgCallback} callback - result callback, 2 parameters: error, and result image buffer
 */
async function svg2img( svg: string | Buffer, options: Svg2ImgCoreProps | Svg2ImgCallback, callback?: Svg2ImgCallback ): Promise<void> {

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

		options         = options as Svg2ImgCoreProps
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

const _getSVGString = ( iconD: Exclude<SvgProps['input'], string | Buffer> ): string => {

	const res = icon( iconD ).html[0]
	return res

}
export const _parse = parse
export const _stringify = stringify

export const _svgToBuffer = async ( svgData: SvgProps['input'], opts?: Svg2ImgCoreProps ) => {

	return new Promise<Buffer>( async ( resolve, reject ) => {

		if ( typeof svgData !== 'string' && !Buffer.isBuffer( svgData ) ) svgData = _getSVGString( svgData )
		else svgData = await _getMediaInputString( svgData )
		let parsedData = await parse( svgData )

		if ( parsedData ) {

			if ( parsedData.name === 'svg' && parsedData.attributes.xmlns == undefined )
				parsedData.attributes.xmlns = 'http://www.w3.org/2000/svg'

			if ( opts?.transformNode )
				parsedData = await opts.transformNode( parsedData )

			svgData = stringify( parsedData )

		}

		svg2img( svgData, opts || {}, ( error, buffer ) => {

			if ( error ) {

				reject( error )

			}
			else {

				if ( !buffer ) return reject( 'Does not exist result' )

				resolve( buffer )

			}

		} )

	} )

}
