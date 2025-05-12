/**
 * Tests.
 *
 * @description File for set test functions.
 */

import {
	describe,
	it,
	expect,
} from 'vitest'

import * as obj from '.'
import * as fs  from '../sys'

// const path         = './__test_dir'
const jsonDir      = fs.getAbsolutePath( './' ) // absolute to execution process
const jsonFileName = 'package'
const jsonFile     = jsonFileName + '.json'
const tomlUrl      = 'https://raw.githubusercontent.com/pigeonposse/super8/main/packages/app/src-tauri/Cargo.toml'
const ymlUrl       = 'https://raw.githubusercontent.com/pigeonposse/super8/main/.pigeonposse.yml'
const jsonUrl      = 'https://raw.githubusercontent.com/pigeonposse/super8/main/package.json'

describe( 'FS - get Object From Path', () => {

	it( 'should return data from a JSON file', async () => {

		const data = await obj.getObjectFromPath( jsonDir, jsonFileName )
		expect( typeof data ).toBe( 'object' )

	} )

} )

describe( 'FS - get Object From Url', () => {

	it( 'should return parsed YAML data from URL', async () => {

		const data = await obj.getObjectFromUrl( ymlUrl )
		expect( typeof data ).toBe( 'object' )
		// // @ts-ignore
		// expect( data.web[0].id ).toBe( 'super8' )

	} )

	it( 'should return parsed TOML data from URL', async () => {

		const data = await obj.getObjectFromUrl( tomlUrl )
		expect( typeof data ).toBe( 'object' )
		// // @ts-ignore
		// expect( data.package.name ).toBe( 'super8' )

	} )

	it( 'should return parsed JSON data from URL', async () => {

		const data = await obj.getObjectFromUrl( jsonUrl )
		expect( typeof data ).toBe( 'object' )
		// // @ts-ignore
		// expect( data.name ).toBe( 'super8' )

	} )

} )

describe( 'FS - get Object From Unkwon', () => {

	it( 'should return data from a JSON file AND (YAML, TOML, YAML) URL', async () => {

		expect( typeof await obj.getObjectFrom( fs.joinPath( jsonDir, jsonFile ) ) ).toBe( 'object' )
		expect( typeof await obj.getObjectFrom( ymlUrl ) ).toBe( 'object' )
		expect( typeof await obj.getObjectFrom( tomlUrl ) ).toBe( 'object' )
		expect( typeof await obj.getObjectFrom( jsonUrl ) ).toBe( 'object' )

	} )

} )
