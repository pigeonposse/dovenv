import { execModulePath } from '@dovenv/utils'
import {
	isBun,
	joinPath,
	createDir,
} from '@dovenv/utils'

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type TermGifConfig = {
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

const runCli = async  ( args: string[] = [] ) => {

	// process.argv = [
	// 	'runtime',
	// 	'cli',
	// 	...args,
	// ]
	// await import( 'terminalizer/bin/app.js' )
	// await new Promise<void>( ( resolve, reject ) => {

	// 	const binPath = getModulePath( 'terminalizer', [ 'bin', 'app.js' ] )
	// 	const child   = fork( binPath, args, { stdio: 'inherit' } )
	// 	child.on( 'close', code => {

	// 		if ( code === 0 ) return resolve()

	// 		console.warn( `[termgif] exited with code ${code}` )
	// 		return reject()

	// 	} )

	// } )
	console.log( import.meta.url )
	await execModulePath( {
		currentPath : import.meta.url,
		moduleEntry : 'terminalizer',
		modulePath  : [ 'bin', 'app.js' ],
		args,
	} )

}

/**
 * Generate a config file in the current directory
 */
export const terminalGifCreateConfg = async () => {

	await runCli( [ 'config' ] )

}

class TermGif {

	opts
	recordFile

	constructor( opts: TermGifConfig ) {

		if ( isBun ) console.warn( 'Bun runtime is possibly incompatible with termgif' )
		this.opts       = opts
		this.recordFile = joinPath( opts.output, 'record' )

	}

	async #runCli( args: string[] = [] ) {

		await runCli( args )

	}

	async record( ) {

		const opts = this.opts

		await createDir( opts.output )
		const configFile = opts.configPath ? [ '--config', opts.configPath ] : []
		// const gif        = joinPath( opts.output, 'gif.gif' )
		// const quality    = opts.quality ? [ '--quality', String( opts.quality ) ] : []
		// const step       = opts.step ? [ '--step', String( opts.step ) ] : []

		await this.#runCli( [
			'record',
			this.recordFile,
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

	async render(  ) {

		const opts    = this.opts
		const gifFile = joinPath( opts.output, 'gif' )
		const quality = opts.quality ? [ '--quality', String( opts.quality ) ] : []
		const step    = opts.step ? [ '--step', String( opts.step ) ] : []

		await this.#runCli( [
			'render',
			this.recordFile,
			'--output',
			gifFile,
			...quality,
			...step,
		] )

	}

	async generatePlayer(  ) {

		await this.#runCli( [ 'generate', this.recordFile ] )

	}

}

export const terminalGif = ( opts: TermGifConfig ) => new TermGif( opts )
