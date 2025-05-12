
import {
	getStringType,
	joinPath,
	writeFileContent,
	removeFileIfExist,
	ensureDir,
} from '@dovenv/core/utils'

import { Core } from './core'

export type CodeImageConfigValue = {
	/** The input path, URL or Code string to generate the image from */
	input     : string
	/** The output path where the image will be saved. If not provided, the current working directory will be used. */
	output?   : string
	/** The filename of the image. If not provided, the original filename will be used. */
	filename? : string
	/**
	 * Flags to pass to the command `carbon-now-cli`.
	 *
	 * @see https://www.npmjs.com/package/carbon-now-cli
	 */
	flags?    : string[]
}

export type CodeImageConfig = { [key: string]: CodeImageConfigValue }

export class CodeImage extends Core<CodeImageConfig> {

	async exec( opts: CodeImageConfigValue ) {

		let input = opts.input

		try {

			const {
				output = this.utils.process.cwd(),
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

			await this.utils.execPkgBin( 'carbon-now-cli', [
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

	async run( pattern?: string[] ) {

		return await this.execFn( {
			pattern,
			desc : 'Code Image Generation',
			fn   : d => this.exec( d ),
		} )

	}

}
