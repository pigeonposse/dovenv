/**
 * Tests.
 * @description File for set test functions.
 */

import {
	describe,
	it,
	expect,
} from 'vitest'

import * as fs from './main'

const path   = './__test_dir'
const imgUrl = 'https://raw.githubusercontent.com/pigeonposse/super8/main/docs/public/logo.png'

describe( 'Fs - Directory', () => {

	it( 'should create check and remove directory successfully', async () => {

		// Arrange
		await fs.createDir( path )

		// Act
		const existsBeforeRemoval = await fs.existsDir( path )
		const isDir               = await fs.isDirectory( path )
		await fs.removeDirIfExist( path )

		// Assert
		expect( existsBeforeRemoval ).toBe( true )
		expect( isDir ).toBe( true )

	} )

	it( 'should throw error when checking directory on non-existing path', async () => {

		// Arrange
		const exist = await fs.existsDir( path )
		// Act & Assert
		expect( exist ).toBe( false )
		expect( async () => await fs.isDirectory( path ) ).rejects.toThrowError( )

	} )

} )

describe( 'FS - fetchContent', () => {

	it( 'should fetch text content from a URL', async () => {

		const url     = 'https://example.com'
		const content = await fs.fetch2string( url )
		expect( typeof content ).toBe( 'string' )
		expect( content ).toContain( 'Example Domain' )

	} )

	it( 'should fetch base64-encoded image content from a URL', async () => {

		const content = await fs.fetch2string( imgUrl )
		expect( typeof content ).toBe( 'string' )

		expect( content ).toMatch( /^data:image\/[a-zA-Z]*;base64,/ )

	} )

	it( 'should throw an error when URL is invalid', async () => {

		const url = 'https://invalidurl'
		await expect( fs.fetch2string( url ) ).rejects.toThrow()

	} )

} )

