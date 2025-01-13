import { PluginCore }   from '@dovenv/core'
import { process }      from '@dovenv/core/utils'
import imagemin         from 'imagemin'
import imageminGif      from 'imagemin-gifsicle'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminOptipng  from 'imagemin-optipng'
// import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import imageminWebp from 'imagemin-webp'

export type WebpOpts = Parameters<typeof imageminWebp>[0]

type GifOpts = imageminGif.Options
type JpegOpts = Parameters<typeof imageminJpegtran>[0]
type PngOpts = Parameters<typeof imageminOptipng>[0]
type SvgOpts =  Parameters<typeof imageminSvgo>[0]

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

export class ImageMin extends PluginCore<ImageMinConfig> {

	title = 'imagemin'
	async exec( conf:ImageMinConfigValue ) {

		await imagemin( conf.input, {
			// @ts-ignore
			destination : conf.output || process.cwd(),
			plugins     : [
				...( !conf.opts?.gif ? [] : [ imageminGif( conf.opts.gif === true ? {} : conf.opts.gif ) ] ),
				...( !conf.opts?.jpeg ? [] : [ imageminJpegtran( conf.opts.jpeg === true ? {} : conf.opts.jpeg ) ] ),
				...( !conf.opts?.png ? [] : [ imageminOptipng( conf.opts.png === true ? {} : conf.opts.png ) ] ),
				...( !conf.opts?.svg ? [] : [ imageminSvgo( conf.opts.svg === true ? {} : conf.opts.svg ) ] ),
				...( !conf.opts?.webp ? [] : [ imageminWebp( conf.opts.webp === true ? {} : conf.opts.webp ) ] ),
			],
		} )

	}

	async #fn( pattern?: string[] ) {

		if ( !( await this.ensureOpts() ) || !this.opts ) return

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		for ( const key of keys ) {

			console.log( this.style.info.h( `${this.style.badge( key )} ${this.title}` ) )
			await this.exec( this.opts[key] )

		}

	}

	async run( pattern?: string[] ) {

		return await this.catchFn( this.#fn( pattern ) )

	}

}
