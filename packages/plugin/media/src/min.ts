
import { LazyLoader } from '@dovenv/core/utils'

import { Core } from './core'

import type imageminGif      from 'imagemin-gifsicle'
import type imageminJpegtran from 'imagemin-jpegtran'
import type imageminOptipng  from 'imagemin-optipng'
import type imageminSvgo     from 'imagemin-svgo'
import type imageminWebp     from 'imagemin-webp'

export type WebpOpts = Parameters<typeof imageminWebp>[0]

type GifOpts = imageminGif.Options
type JpegOpts = Parameters<typeof imageminJpegtran>[0]
type PngOpts = Parameters<typeof imageminOptipng>[0]
type SvgOpts = Parameters<typeof imageminSvgo>[0]

export type ImageMinConfigValue = {
	input   : string[]
	output? : string
	opts?   : {
		webp? : WebpOpts | true
		gif?  : GifOpts | true
		jpeg? : JpegOpts | true
		png?  : PngOpts | true
		svg?  : SvgOpts | true
	}
}
export type ImageMinConfig = { [key: string]: ImageMinConfigValue }
const _deps = new LazyLoader( {
	imagemin         : async () => ( await import( 'imagemin' ) ).default,
	imageminGif      : async () => ( await import( 'imagemin-gifsicle' ) ).default,
	imageminJpegtran : async () => ( await import( 'imagemin-jpegtran' ) ).default,
	imageminOptipng  : async () => ( await import( 'imagemin-optipng' ) ).default,
	imageminSvgo     : async () => ( await import( 'imagemin-svgo' ) ).default,
	imageminWebp     : async () => ( await import( 'imagemin-webp' ) ).default,
} )

export class ImageMin extends Core<ImageMinConfig> {

	async exec( conf: ImageMinConfigValue ) {

		const imagemin = await _deps.get( 'imagemin' )

		await imagemin( conf.input, {
			// @ts-ignore
			destination : conf.output || this.utils.process.cwd(),
			plugins     : [
				...( !conf.opts?.gif ? [] : [ ( await _deps.get( 'imageminGif' ) )( conf.opts.gif === true ? {} : conf.opts.gif ) ] ),
				...( !conf.opts?.jpeg ? [] : [ ( await _deps.get( 'imageminJpegtran' ) )( conf.opts.jpeg === true ? {} : conf.opts.jpeg ) ] ),
				...( !conf.opts?.png ? [] : [ ( await _deps.get( 'imageminOptipng' ) )( conf.opts.png === true ? {} : conf.opts.png ) ] ),
				...( !conf.opts?.svg ? [] : [ ( await _deps.get( 'imageminSvgo' ) )( conf.opts.svg === true ? {} : conf.opts.svg ) ] ),
				...( !conf.opts?.webp ? [] : [ ( await _deps.get( 'imageminWebp' ) )( conf.opts.webp === true ? {} : conf.opts.webp ) ] ),
			],
		} )

	}

	async run( pattern?: string[] ) {

		return await this.execFn( {
			pattern,
			desc : 'Minification',
			fn   : d => this.exec( d ),
		} )

	}

}
