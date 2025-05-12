import fs   from 'fs'
import path from 'path'

import {
	compressFile,
	decompress,
	compressDir,
	compressFiles,
} from './compress'

const output    = path.join( process.cwd(), 'build', 'compress' )
const testDir   = path.resolve( output, 'testDir' )
const testFile  = path.resolve( output, 'testFile.txt' )
const outputDir = path.resolve( output, 'output' )

// Helper function to create a test file
if ( !fs.existsSync( testFile ) ) {

	fs.writeFileSync( testFile, 'This is a test file content' )

}

// Helper function to create a test directory and a test file inside it
if ( !fs.existsSync( testDir ) ) {

	fs.mkdirSync( testDir, { recursive: true } )
	fs.copyFileSync( testFile, path.join( testDir, 'testFile.txt' ) ) // Copy the test file inside the directory

}

console.log( 'Testing file compression...' )
const compressedFilePath = await compressFile( {
	input  : testFile,
	output : outputDir,
	format : 'zip', // Test ZIP format
} )
console.log( 'File compressed to:', compressedFilePath )

// Test decompressing a file
console.log( 'Testing file decompression...' )
await decompress( {
	input  : compressedFilePath,
	output : outputDir,
	format : 'zip',
	remove : true, // Optionally remove the original compressed file
} )
console.log( 'File decompressed successfully.' )

// Test compressing a directory
console.log( 'Testing directory compression...' )
const compressedDirPath = await compressDir( {
	input  : testDir,
	output : outputDir,
	format : 'tgz', // Test TGZ format
} )
console.log( 'Directory compressed to:', compressedDirPath )

// Test decompressing a directory
console.log( 'Testing directory decompression...' )
await decompress( {
	input  : compressedDirPath,
	output : outputDir,
	format : 'tgz',
	remove : true,
} )
console.log( 'Directory decompressed successfully.' )

// Test compressing multiple files with patterns
console.log( 'Testing compressing multiple files...' )
await compressFiles( {
	input  : [ 'testDir/*.txt' ],
	output : outputDir,
	format : 'gz', // Test Gzip format
} )
console.log( 'Multiple files compressed successfully.' )

