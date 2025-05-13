import {
	compressFile,
	decompress,
	compressDir,
	compressFiles,
	ensureDir,
	resolvePath,
	joinPath,
	existsFile,
	writeFile,
	existsDir,
	copyFile,
	createDir,
} from '.'

const output    = joinPath( process.cwd(), 'build', 'compress' )
const testDir   = resolvePath( output, 'testDir' )
const testFile  = resolvePath( output, 'testFile.txt' )
const outputDir = resolvePath( output, 'output' )

await ensureDir( output )

if ( !await existsFile( testFile ) )
	await writeFile( testFile, 'This is a test file content' )

if ( !await existsDir( testDir ) ) {

	await createDir( testDir )
	await copyFile( {
		input  : testFile,
		output : joinPath( testDir, 'testFile.txt' ),
	} )

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
	remove : false, // Optionally remove the original compressed file
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
	input   : compressedDirPath,
	output  : outputDir,
	newName : 'decompressed',
	format  : 'tgz',
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

