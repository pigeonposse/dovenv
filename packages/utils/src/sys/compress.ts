
import archiver   from 'archiver'
import decompress from 'decompress'
// @ts-ignore
import decompressTargz       from 'decompress-targz'
import { createWriteStream } from 'node:fs'
import {
	mkdir,
	readdir,
	rename,
	rm,
} from 'node:fs/promises'
import { cpus } from 'node:os'
import {

	basename,
	extname,
} from 'node:path'

import {
	existsPath,
	joinPath as join,
} from './super'

type DecompresFileOptions = {
	input    : string
	output   : string
	newName? : string
	remove?  : boolean
}

type ZipDirOptions = {
	input    : string
	output   : string
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
}
type ZipFileOptions = {
	input    : string
	output   : string
	name?    : string
	onDone?  : ( n: string ) => void
	onError? : ( n: string, err: Error ) => void
}

/**
 * Decompresses an archive file (zip, tar, tgz) to a specified output directory.
 *
 * @param {object}  options           - The options object.
 * @param {string}  options.input     - The path to the input compressed file.
 * @param {string}  options.output    - The directory where the file should be decompressed.
 * @param {string}  [options.newName] - The new name for the decompressed file or directory.
 * @param {boolean} [options.remove]  - Whether to remove the original compressed file after decompression.
 * @example decompressFile( {
  input   : resolve(  'downloads', 'example-file.zip' ), // Path to the compressed file
  output  : resolve(  'decompressed' ), // Directory where the file should be decompressed
  newName : 'renamed-decompressed-file', // New name for the decompressed file or directory (optional)
  remove  : true, // Remove the original compressed file after decompression
  } )
 */
export async function decompressFile( {
	input, output, newName, remove = false,
} : DecompresFileOptions ) {

	const ext            = extname( input ).toLowerCase()
	const outputFileName = newName || basename( input, ext )
	const outputPath     = join( output, outputFileName )

	try {

		if ( ext === '.zip' ) {

			await decompress( input, output, { strip: 1 } )
			console.log( `File decompressed successfully to ${output}` )

		}
		else if ( ext === '.tar' || ext === '.tgz' || ext === '.gz' ) {

			await decompress( input, output, {
				plugins : [ decompressTargz() ],
				strip   : 1,
			} )
			console.log( `File decompressed successfully to ${output}` )

		}
		else {

			throw new Error( `Unsupported file extension: ${ext}` )

		}

		if ( newName ) {

			await rename( join( output, basename( input, ext ) ), outputPath )
			console.log( `File renamed successfully to ${outputPath}` )

		}

		if ( remove ) {

			await rm( input )
			console.log( `Original file ${input} removed successfully` )

		}

	}
	catch ( error ) {

		// @ts-ignore
		console.error( `Error during decompression: ${error.message}` )

	}

}

const zipFileWorker = ( sourceFilePath: string, zipName: string, outputDirectory: string, onDone: ( n: string ) => void, onError: ( n: string, err: Error ) => void ) => {

	return new Promise<void>( ( resolve, reject ) => {

		const output  = createWriteStream( join( outputDirectory, zipName ) )
		const archive = archiver( 'zip', { zlib: { level: 6 } } ) // Reduced compression level for speed

		output.on( 'close', () => {

			onDone( zipName )
			resolve()

		} )

		archive.on( 'error', err => {

			onError( zipName, err )
			reject( err )

		} )

		archive.pipe( output )
		archive.file( sourceFilePath, { name: zipName.replace( '.zip', '' ) } )
		archive.finalize()

	} )

}

/**
 * Zips the specified file and saves it to the output directory.
 *
 * @param   {ZipFileOptions} options           - An object with properties.
 * @param   {string}         options.input     - The path to the file to be zipped.
 * @param   {string}         options.output    - The directory where the zip file should be saved.
 * @param   {string}         [options.name]    - The desired name for the zip file. If not provided, the original file name with `.zip` appended will be used.
 * @param   {Function}       [options.onDone]  - A callback to be called after the zip file is created. Takes a single argument of the zip file name.
 * @param   {Function}       [options.onError] - A callback to be called if an error occurs during the zipping process. Takes two arguments: the zip file name, and the error.
 * @returns {Promise<void>}
 */
export const zipFile = async ( {
	input,
	output,
	name,
	onDone = () => {},
	onError = () => {},
}: ZipFileOptions ) => {

	const zipName = name ? ( name.endsWith( '.zip' ) ? name : `${name}.zip` ) : basename( input )
	return await zipFileWorker( input, zipName, output, onDone, onError )

}

/**
 * Zips the files in the specified source directory and saves them to the output directory.
 *
 * @param   {ZipDirOptions} options           - An object with properties.
 * @param   {string}        options.input     - The path to the source directory containing files to zip.
 * @param   {string}        options.output    - The path to the output directory where zip files will be saved.
 * @param   {Function}      [options.onDone]  - A function to be called after each zip file is created. Takes a string argument of the created zip file name.
 * @param   {Function}      [options.onError] - A function to be called if an error occurs. Takes two arguments: the zip file name, and the error.
 * @returns {Promise<void>}
 */
export const zipFilesInDirectory = async ( {
	input,
	output,
	onDone = () => {},
	onError = () => {},
}: ZipDirOptions ) => {

	const createZipForFileInThread = async ( sourceDirectory: string, file: string, outputDirectory: string, onDone: ( n: string ) => void, onError: ( n: string, err: Error ) => void ) => {

		const sourceFilePath = join( sourceDirectory, file )
		const zipName        = `${file}.zip`
		return zipFileWorker( sourceFilePath, zipName, outputDirectory, onDone, onError )

	}

	const filter = ( file: string ) => !( /(^|\/)\.[^\\/\\.]/g ).test( file )

	// Ensure that the output directory exists or create it if it doesn't
	if ( !( await existsPath( input ) ) ) await mkdir( output, { recursive: true } )

	const files        = await readdir( input )
	const visibleFiles = files.filter( filter )
	const cpuCount     = cpus().length
	const fileChunks   = []

	for ( let i = 0; i < visibleFiles.length; i += cpuCount ) {

		fileChunks.push( visibleFiles.slice( i, i + cpuCount ) )

	}

	// Process each chunk in parallel using workers
	await Promise.all( fileChunks.map( async chunk => {

		await Promise.all( chunk.map( file => createZipForFileInThread( input, file, output, onDone, onError ) ) )

	} ) )

}
