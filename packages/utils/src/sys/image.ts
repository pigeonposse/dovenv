import {
	getExtName,
	readFile,
} from './super'

/**
 * Converts an image file to a Data URI.
 *
 * @param   {object}          opts        - Options.
 * @param   {string}          opts.input  - The path to the image file.
 * @param   {string}          [opts.type] - The MIME type to use for the Data URI. If not provided, the function will try to guess the type based on the file extension.
 * @returns {Promise<string>}             - A promise that resolves to the Data URI.
 * @example
 * const dataUri = await image2DataUri({ input: './logo.png' })
 */
export const image2DataUri = async ( opts: {
	input : string
	type? : string
} ) => {

	const getMimeType = ( ext: string ): string => {

		ext = ext.toLowerCase()
		switch ( ext ) {

			case 'svg' :
				return 'image/svg+xml'
			case 'jpg' :
			case 'jpeg' :
				return 'image/jpeg'
			case 'png' :
			case 'gif' :
			case 'webp' :
			case 'bmp' :
			case 'tiff' :
				return `image/${ext}`
			default :
				return 'application/octet-stream'

		}

	}
	const ext = getExtName( opts.input ).replace( '.', '' )

	const file         = await readFile( opts.input )
	const type         = opts.type || getMimeType( ext )
	const base64String = file.toString( 'base64' )

	return `data:${type};base64,${base64String}`

}
