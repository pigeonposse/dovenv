// import {
// 	describe,
// 	expect,
// 	it,
// 	vi,
// } from 'vitest'

// import { downloadGitHubDir } from './download'

// vi.mock( './download', () => ( {
// 	__esModule : true,
// 	download   : vi.fn(),
// } ) )

// describe( 'downloadGitHubDir', () => {

// 	it( 'should call download with valid URL and output directory', async () => {

// 		const url    = 'https://github.com/pigeonposse/backan/tree/master/docs'
// 		const output = './output'
// 		await downloadGitHubDir( url, output )
// 		expect( download ).toHaveBeenCalledTimes( 1 )
// 		expect( download ).toHaveBeenCalledWith( url, output, undefined )

// 	} )

// 	it( 'should throw error with invalid URL', async () => {

// 		const url    = 'invalid-url'
// 		const output = './output'
// 		await expect( downloadGitHubDir( url, output ) ).rejects.toThrowError()

// 	} )

// 	it( 'should throw error with invalid output directory', async () => {

// 		const url    = 'https://github.com/pigeonposse/backan/tree/master/docs'
// 		const output = 'invalid-output'
// 		await expect( downloadGitHubDir( url, output ) ).rejects.toThrowError()

// 	} )

// 	it( 'should call download with token', async () => {

// 		const url    = 'https://github.com/pigeonposse/backan/tree/master/docs'
// 		const output = './output'
// 		const token  = 'token'
// 		await downloadGitHubDir( url, output, token )
// 		expect( download ).toHaveBeenCalledTimes( 1 )
// 		expect( download ).toHaveBeenCalledWith( url, output, { token } )

// 	} )

// 	it( 'should call download without token', async () => {

// 		const url    = 'https://github.com/pigeonposse/backan/tree/master/docs'
// 		const output = './output'
// 		await downloadGitHubDir( url, output )
// 		expect( download ).toHaveBeenCalledTimes( 1 )
// 		expect( download ).toHaveBeenCalledWith( url, output, undefined )

// 	} )

// } )
