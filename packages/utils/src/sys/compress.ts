
import {
	zip,
	tar,
	tgz,
	gzip,
} from 'compressing'

import {
	ensureDir,
	getBaseName,
	getExtName,
	getPaths,
	isDirectory,
	joinPath as join,
	removeFile,
} from './super'

import { getRandomUUID } from '@/string'

const FORMATS = {
	ZIP : 'zip',
	TAR : 'tar',
	TGZ : 'tgz',
	GZ  : 'gz',
} as const

type CompressFormat = typeof FORMATS[keyof typeof FORMATS]
type CompressTypeAdvancedOpts = {
	zip?  : Record<string, unknown>
	tar?  : Record<string, unknown>
	tgz?  : Record<string, unknown>
	gzip? : Record<string, unknown>
}
type DecompresFileOptions = {
	/**
	 * The path to the input compressed file.
	 */
	input    : string
	/**
	 * The directory where the file should be decompressed.
	 */
	output?  : string
	/**
	 * The new name for the decompressed file or directory.
	 */
	newName? : string
	/**
	 * The format of the compressed file.
	 * Automatically detected if not specified.
	 *
	 * @default 'auto'
	 */
	format?  : CompressFormat | 'auto'
	/**
	 * Whether to remove the original compressed file after decompression.
	 *
	 * @default false
	 */
	remove?  : boolean
	/**
	 * Additional options for compression.
	 *
	 * @see https://www.npmjs.com/package/compressing
	 */
	opts?    : CompressTypeAdvancedOpts
}

type CompressOptionsShared = {
	/**
	 * Output directory
	 *
	 * @default process.cwd()
	 */
	output? : string
	/**
	 * The format of the compressed file.
	 * Automatically detected if not specified.
	 *
	 * @default 'zip'
	 */
	format? : CompressFormat
	/**
	 * Additional options for compression.
	 *
	 * @see https://www.npmjs.com/package/compressing
	 */
	opts?   : CompressTypeAdvancedOpts
}

type CompressOptions = CompressOptionsShared & {
	/**
	 * The path to the input file or directory.
	 */
	input : string
	/**
	 * The new name for the compressed file.
	 * If not specified, random UUID will be used.
	 */
	name? : string
}
type CompressDirOptions = CompressOptionsShared & {
	/**
	 * The path to the input directory.
	 */
	input : string
	/**
	 * The new name for the compressed file.
	 * If not specified, random UUID will be used.
	 */
	name? : string
}

type CompressFileOptions = CompressOptionsShared & {
	/**
	 * The path to the input file.
	 */
	input : string
	/**
	 * The new name for the compressed file.
	 * If not specified, random UUID will be used.
	 */
	name? : string
}

type CompressFilesOptions = CompressOptionsShared & {
	/**
	 * Array of patterns to compress.
	 *
	 * @example ['dist/*.js']
	 */
	input      : string[]
	/**
	 * Additional options for input patterns.
	 */
	inputOpts? : Parameters<typeof getPaths>[1]
	/**
	 * Hook functions.
	 */
	hook? : {
		/**
		 * Before compressing a file.
		 */
		beforeFile? : ( n: string ) => void | Promise<void>
		/**
		 * After compressing a file.
		 */
		afterFile?  : ( n: string ) => void | Promise<void>
	}
}

const _FORMAT_DEFAULT            = FORMATS.ZIP
const AUTO_FORMAT                = 'auto'
const _getDefaultOutputDirectory = () => process.cwd()
const _sanitizeExt               = ( f: string ) => f.toLowerCase().replace( '.', '' )
const _setErrorFormat            = ( v: string ) => `Unsupported compression format: ${v}. Supported formats: ${Object.values( FORMATS ).join( ', ' )}`

export {
	tgz,
	tar,
	zip,
	gzip,
}

/**
 * Decompresses an archive file (zip, tar, tgz) to a specified output directory.
 *
 * @param   {object}          params - The options object.
 * @returns {Promise<string>}        - A promise that resolves to the path of the decompressed file or directory.
 * @example
 * await decompressFile( {
 *   input   : resolve(  'downloads', 'example-file.zip' ), // Path to the compressed file
 *   output  : resolve(  'decompressed' ),                  // Directory where the file should be decompressed
 *   newName : 'renamed-decompressed-file',                 // New name for the decompressed file or directory (optional)
 *   remove  : true,                                        // Remove the original compressed file after decompression
 * } )
 */
export const decompress = async ( params : DecompresFileOptions ) => {

	const {
		input,
		output = _getDefaultOutputDirectory(),
		newName,
		remove = false,
		format = AUTO_FORMAT,
		opts,
	} = params

	const ext            = getExtName( input )
	const formatC        = format !== AUTO_FORMAT ? format : _sanitizeExt( ext )
	const outputFileName = newName || getBaseName( input, ext )
	const outputPath     = join( output, outputFileName )

	if ( formatC === FORMATS.ZIP )
		await zip.uncompress( input, outputPath, opts?.zip || { strip: 1 } )
	else if ( formatC === FORMATS.TAR )
		await tar.uncompress( input, outputPath, opts?.tar || { strip: 1 } )
	else if ( formatC === FORMATS.TGZ )
		await tgz.uncompress( input, outputPath, opts?.tgz || { strip: 1 } )
	else if ( formatC === FORMATS.GZ )
		await gzip.uncompress( input, outputPath, opts?.gzip || { strip: 1 } )
	else throw new Error( _setErrorFormat( format ) )

	if ( remove ) await removeFile( input )

	return outputPath

}

/**
 * Compresses multiple files matching the given input patterns to a specified output directory.
 *
 * @param   {CompressFilesOptions} params - The options object.
 * @returns {Promise<void>}               - A promise that resolves when all files have been compressed.
 * @example
 * await compressFiles( {
 *   input  : [ 'src/*.js' ],
 *   output : 'compressed',
 *   format : 'tar',
 *   hook   : {
 *     beforeFile: (file) => console.log(`Compressing ${file}...`),
 *     afterFile : (file) => console.log(`${file} compressed.`),
 *   },
 * } )
 */

export const compressFiles = async ( params: CompressFilesOptions ) => {

	const {
		input,
		output = _getDefaultOutputDirectory(),
		hook,
		format = _FORMAT_DEFAULT,
		inputOpts = {},
	} = params

	await ensureDir( output )

	const files = await getPaths( input, {
		onlyFiles : true,
		dot       : true,
		...inputOpts,
	} )

	await Promise.all( files.map( async file => {

		await hook?.beforeFile?.( file )
		await compressFile( {
			input : file,
			output,
			name  : getBaseName( file ),
			format,
		} )
		await hook?.afterFile?.( file )

	} ) )

}

/**
 * Compresses a file to a specified output directory.
 *
 * @param   {object}          params - The options object.
 * @returns {Promise<string>}        - A promise that resolves to the path of the compressed file.
 * @example
 * const compressedFilePath = await compressFile( {
 *   input : resolve( 'file.txt' ),
 *   output: resolve( 'compressed' ),
 *   name  : 'renamed-compressed-file',
 *   format: 'tar',
 *   opts  : {
 *     tar: {
 *       strip: 1,
 *     },
 *   },
 * } )
 */
export const compressFile = async ( params: CompressFileOptions ) => {

	const {
		input,
		output = _getDefaultOutputDirectory(),
		name = getRandomUUID(),
		format = _FORMAT_DEFAULT,
		opts,
	} = params

	const archiveName = `${name}.${format}`
	const archivePath = join( output, archiveName )

	await ensureDir( output )

	if ( format === FORMATS.ZIP )
		await zip.compressFile( input, archivePath, opts?.zip )
	else if ( format === FORMATS.TAR )
		await tar.compressFile( input, archivePath, opts?.tar )
	else if ( format === FORMATS.TGZ )
		await tgz.compressFile( input, archivePath, opts?.tgz )
	else if ( format === FORMATS.GZ )
		await gzip.compressFile( input, archivePath, opts?.gzip )
	else throw new Error( _setErrorFormat( format ) )

	return archivePath

}

/**
 * Compresses a directory to a specified output directory.
 *
 * @param   {object}          params - The options object.
 * @returns {Promise<string>}        - A promise that resolves to the path of the compressed archive file.
 * @example
 * const compressedFilePath = await compressDir( {
 *   input   : resolve(  'build' ), // Path to the directory to compress
 *   output  : resolve(  'dist' ), // Directory where the compressed file should be saved
 *   name    : 'compressed-archive', // Optional name for the compressed archive file
 *   format  : 'zip', // Optional format for the compressed archive file
 * } )
 */
export const compressDir = async ( params: CompressDirOptions ): Promise<string> => {

	const {
		input,
		output = _getDefaultOutputDirectory(),
		name = getRandomUUID(),
		format = _FORMAT_DEFAULT,
		opts,
	} = params

	const archiveName = `${name}.${format}`
	const archivePath = join( output, archiveName )

	await ensureDir( output )

	if ( format === FORMATS.ZIP )
		await zip.compressDir( input, archivePath, opts?.zip )
	else if ( format === FORMATS.TAR )
		await tar.compressDir( input, archivePath, opts?.tar )
	else if ( format === FORMATS.TGZ )
		await tgz.compressDir( input, archivePath, opts?.tgz )
	else if ( format === FORMATS.GZ )
		throw new Error( 'Gzip compression of directories is not supported.' )
	else throw new Error( _setErrorFormat( format ) )

	return archivePath

}

/**
 * Compresses a file or directory to a specified output directory.
 *
 * @param   {object}          opts - The options object.
 * @returns {Promise<string>}      - A promise that resolves to the path of the compressed archive file.
 * @example
 * const compressedFilePath = await compress( {
 *   input   : resolve(  'build' ), // Path to the directory or file to compress
 *   output  : resolve(  'dist' ), // Directory where the compressed file should be saved
 *   name    : 'compressed-archive', // Optional name for the compressed archive file
 *   format  : 'zip', // Optional format for the compressed archive file
 * } )
 */
export const compress = async ( opts: CompressOptions ) => {

	const isDir = await isDirectory( opts.input )
	return ( isDir )
		? await compressDir( opts )
		: await compressFile( opts )

}
