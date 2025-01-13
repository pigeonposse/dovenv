import { PluginCore } from '@dovenv/core'
import {
	isBun,
	joinPath,
	createDir,
} from '@dovenv/core/utils'

import type { Config } from '@dovenv/core'

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type TermGifConfigValue = {
	/** A name for the output directory */
	output      : string
	/**
	 * The path of the config file. Overwrite the default configurations.
	 * create your own config file with command `termgif config`
	 */
	configPath? : string
	/** The command to be executed */
	command?    : string
	/** The quality of the rendered image (1 - 100)  */
	quality?    : IntRange<1, 101>
	/**
	 * To reduce the number of rendered frames (step > 1)
	 * @default 1
	 */
	step?       : number
}
export type TermGifConfig = { [key: string]: TermGifConfigValue }

export class TerminalGif extends PluginCore<TermGifConfig> {

	title = 'termgif'

	constructor( opts?: TermGifConfig, config?: Config ) {

		super( opts, config )
		if ( isBun ) console.warn( 'Bun runtime is possibly incompatible with termgif' )

	}

	async #exec( args: string[] = [] ) {

		await this.execPkgBin( 'terminalizer', args )

	}

	async record( opts: TermGifConfig[number] ) {

		await createDir( opts.output )
		const configFile = opts.configPath ? [ '--config', opts.configPath ] : []

		// const gif        = joinPath( opts.output, 'gif.gif' )
		// const quality    = opts.quality ? [ '--quality', String( opts.quality ) ] : []
		// const step       = opts.step ? [ '--step', String( opts.step ) ] : []

		await this.#exec( [
			'record',
			joinPath( opts.output, 'record' ),
			...configFile,
			'--skip-sharing',
		] ).then( () => {

			console.log( 'Generating gif file' )
			return

		} )

		// await this.#runCli( [
		// 	'render',
		// 	recordFile,
		// 	'gif.gif',
		// 	...quality,
		// 	...step,
		// ] )

	}

	async render( opts: TermGifConfig[number]  ) {

		const gifFile = joinPath( opts.output, 'gif' )
		const quality = opts.quality ? [ '--quality', String( opts.quality ) ] : []
		const step    = opts.step ? [ '--step', String( opts.step ) ] : []

		await this.#exec( [
			'render',
			joinPath( opts.output, 'record' ),
			'--output',
			gifFile,
			...quality,
			...step,
		] )

	}

	async createConfig() {

		await this.#exec( [ 'config' ] )

	}

	async #fn( pattern?: string[], type: 'render' | 'record' = 'render' ) {

		if ( !( await this.ensureOpts() ) || !this.opts ) return

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		for ( const key of keys ) {

			console.log( this.style.info.msg( `${this.style.badge( key )} ${this.title}`, type ) )

			if ( type == 'record' ) await this.record( this.opts[key] )
			else await this.render( this.opts[key] )

		}

	}

	async run( pattern?: string[], type?: 'render' | 'record' ) {

		return await this.catchFn( this.#fn( pattern, type ) )

	}

}
