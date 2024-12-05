import {
	process,
	getStringType,
	joinPath,
	writeFileContent,
	removeFileIfExist,
	runLocalBin,
} from '@dovenv/core/utils'

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

		// process.argv = [
		// 	input,
		// 	`--save-to ${out}`,
		// 	...( filename ? [ `--save-as ${filename}` ] : [] ),
		// 	...flags,
		// ]

		// // @ts-ignore
		// await import( 'carbon-now-cli' )

		await runLocalBin( {
			name : 'carbon-now',
			args : [
				input,
				`--save-to ${out}`,
				...( filename ? [ `--save-as ${filename}` ] : [] ),
				...flags,
			],
		} )

	}
	catch ( e ) {

		console.error( e )

	}
	finally {

		await removeFileIfExist( input )

	}

}
