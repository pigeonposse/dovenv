
import {
	isBun,
	joinPath,
	createDir,
} from '@dovenv/core/utils'

import { Core } from './core'

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type TermGifConfigValue = {
	/** A name for the output directory */
	output      : string
	/**
	 * The path of the config file. Overwrite the default configurations.
	 * Create your own config file with command `termgif config`.
	 */
	configPath? : string
	/** The command to be executed */
	command?    : string
	/** The quality of the rendered image (1 - 100)  */
	quality?    : IntRange<1, 101>
	/**
	 * To reduce the number of rendered frames (step > 1).
	 *
	 * @default 1
	 */
	step?       : number
}
export type TermGifConfig = { [key: string]: TermGifConfigValue }

export class TerminalGif extends Core<TermGifConfig> {

	constructor( ...d: ConstructorParameters<typeof Core<TermGifConfig>> ) {

		super( ...d )
		if ( isBun ) console.warn( 'Bun runtime is possibly incompatible with termgif' )

	}

	async #exec( args: string[] = [] ) {

		await this.utils.execPkgBin( 'terminalizer', args )

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

	async render( opts: TermGifConfig[number] ) {

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

	async run( pattern?: string[], type?: 'render' | 'record' ) {

		if ( type === 'record' ) return await this.execFn( {
			pattern,
			desc : `Terminal Gift (${type})`,
			fn   : d => this.record( d ),
		} )
		else return await this.execFn( {
			pattern,
			desc : `Terminal Gift (${type})`,
			fn   : d => this.render( d ),
		} )

	}

}
