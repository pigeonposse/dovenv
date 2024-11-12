import { writeFileContent } from './super/main'

/**
 * Create an image file from a base64 string.
 * @param {string} base64String - Base64 string representing the image.
 * @param {string} outputPath   - Path to save the image file.
 * @throws {Error} If the base64 string is invalid.
 * @example import { createImageFromBase64 } from '@dovenv/utils'
 * const imageBuffer = await createImageFromBase64(base64String)
 */
export async function createImageFromBase64( base64String: string, outputPath: string ): Promise<void> {

	// Extract the content type and base64 data
	// eslint-disable-next-line no-useless-escape
	const matches = base64String.match( /^data:([A-Za-z-+\/]+);base64,(.+)$/ )
	// const contentType = matches[1]
	if ( !matches ) throw Error( 'Invalid base image' )
	const base64Data = matches[2]

	// Convert base64 to buffer
	const buffer = Buffer.from( base64Data, 'base64' )

	// Write the buffer to a file
	await writeFileContent( outputPath, buffer )

}
