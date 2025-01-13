import { PluginCore } from '@dovenv/core'
import {
	process,
	getStringType,
	joinPath,
	writeFileContent,
	removeFileIfExist,
	ensureDir,
} from '@dovenv/core/utils'

export type CodeImageConfigValue = {
	/** The input path, URL or Code string to generate the image from */
	input     : string
	/** The output path where the image will be saved. If not provided, the current working directory will be used. */
	output?   : string
	/** The filename of the image. If not provided, the original filename will be used. */
	filename? : string
	/**
	 * Flags to pass to the command `carbon-now-cli`
	 * @see https://www.npmjs.com/package/carbon-now-cli
	 */
	flags?    : string[]
}

export type CodeImageConfig =  { [key: string]: CodeImageConfigValue }

export class CodeImage extends PluginCore<CodeImageConfig> {

	title = 'codeimage'

	async exec( opts: CodeImageConfigValue ) {

		let input = opts.input

		try {

			const {
				output = process.cwd(),
				filename,
				flags = [],
			} = opts

			if ( !input ) throw new Error( 'Input must exists' )

			const type = getStringType( input )

			if ( type === 'url' || type === 'text' ) {

				await ensureDir( output )
				const inTemp = joinPath( output, '.tempfile' )
				await writeFileContent( inTemp, input )
				input = inTemp

			}

			await this.execPkgBin( 'carbon-now-cli', [
				input,
				`--save-to ${output}`,
				...( filename ? [ `--save-as ${filename}` ] : [] ),
				...flags,
			] )

		}
		catch ( e ) {

			console.error( e )

		}
		finally {

			if ( input ) await removeFileIfExist( input )

		}

	}

	async #fn( pattern?: string[] ) {

		if ( !( await this.ensureOpts() ) || !this.opts ) return

		const keys = this.getKeys( { pattern } )
		if ( !keys ) return

		for ( const key of keys ) {

			console.log( this.style.info.h( `${this.style.badge( key )} ${this.title}`  ) )
			await this.exec( this.opts[key] )

		}

	}

	async run( pattern?: string[] ) {

		return await this.catchFn( this.#fn( pattern ) )

	}

}
