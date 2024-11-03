import {
	process,
	getStringType,
	joinPath,
	writeFileContent,
	removeFileIfExist,
} from '@dovenv/utils'

export type CodeImageConfig = {
	/** The input path, URL or Code string to generate the image from */
	input     : string
	/** The output path where the image will be saved. If not provided, the current working directory will be used. */
	output?   : string
	/** The filename of the image. If not provided, the original filename will be used. */
	filename? : string
	/** Flags to pass to the command `carbon-now-cli`*/
	flags?    : string[]
}
export const generateCodeImage = async ( {
	input, output, flags = [], filename,
}: CodeImageConfig ) => {

	const type = getStringType( input )
	const out  = output || process.cwd()

	try {

		if ( type === 'url' || type === 'text' ) {

			const i = joinPath( out, '.tempfile' )
			await writeFileContent( i, input )
			input = i

		}

		process.argv = [
			'runtime',
			'carbon-now-cli',
			input,
			`--save-to ${out}`,
			...( filename ? [ `--save-as ${filename}` ] : [] ),
			...flags,
		]

		await import( 'carbon-now-cli' )

	}
	catch ( e ) {

		console.error( e )

	}
	finally {

		await removeFileIfExist( input )

	}

}
