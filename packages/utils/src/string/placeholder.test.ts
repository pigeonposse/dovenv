import {
	describe,
	it,
	expect,
} from 'vitest'

import { replacePlaceholders } from './placeholder'

describe( 'replacePlaceholders', () => {

	it( 'should replace multiple placeholders with provided values', async () => {

		const content = `Hello {{ name  }} {{secondName}}! Today is {{ day.short }} ({{day.long }}). Your url is {{ https://example.com }}`

		const result = await replacePlaceholders( {
			content,
			params : {
				name       : 'Alice',
				secondName : 'Copper',
				day        : {
					short : 'Mon',
					long  : 'Monday',
				},
			},
			transform : async ( v: string ) => {

				if ( v === 'https://example.com' ) return 'https://alice.example.com'
				return v

			},
		} )
		expect( result ).toBe( 'Hello Alice Copper! Today is Mon (Monday). Your url is https://alice.example.com' )
		expect( result ).not.toBe( 'Hello Alice Copper! Today is Mon (Monday). Your url is {{ https://example.com }}' )

	} )

	it( 'should return original content if no placeholders exist', async () => {

		const content = 'No placeholders here.'

		const result = await replacePlaceholders( {
			content,
			params    : {},
			transform : async ( v: string ) => {

				if ( v === 'url' ) return 'https://example.com'
				return v

			},
		} )
		expect( result ).toBe( 'No placeholders here.' )

	} )

	it( 'should not handle placeholders that do not exist in params', async () => {

		const result = await replacePlaceholders( {
			content : 'Hello {{ name }}! {{ nonExistent }} is not replaced.',
			params  : { name: 'Alice' },
		} )
		expect( result ).toBe( 'Hello Alice! {{ nonExistent }} is not replaced.' )

	} )

	it( 'should throw error if placeholders that do not exist in params', async () => {

		await expect( replacePlaceholders( {
			content : 'Hello {{ name }}! {{ nonExistent }} is not replaced.',
			params  : { name: 'Alice' },
			opts    : { throw: true },
		} ) ).rejects.toThrow( Error )

	} )

	it( 'should return original content when no replacements are possible', async () => {

		const result = await replacePlaceholders( {
			content : 'Just text, no placeholders.',
			params  : { unknown: 'Value' },
		} )
		expect( result ).toBe( 'Just text, no placeholders.' )

	} )

	it( 'should replace multiple placeholders with provided values', async () => {

		const content = 'hello {{const.name}} {{const.info.secondName}}. Your friend is {{const.info.more[0].friend}}. You are a {{const.info.more[1]}} and a {{const.info.more[2]}}.'
		const result  = await replacePlaceholders( {
			content,
			params : { const : {
				name : 'Alice',
				info : {
					secondName : 'Copper',
					more       : [
						{ friend: 'Tony' },
						'rockstar',
						'pimp',
					],
				},
			} },
		} )
		expect( result ).toBe( 'hello Alice Copper. Your friend is Tony. You are a rockstar and a pimp.' )

	} )
	it( 'Should replace with custom mark', async () => {

		const content = 'hello [[const.name]] [[const.info.secondName]]. Your friend is [[const.info.more[0].friend ]]. You are a [[const.info.more[1] ]] and a [[const.info.more[2] ]].'
		const result  = await replacePlaceholders( {
			content,
			params : { const : {
				name : 'Alice',
				info : {
					secondName : 'Copper',
					more       : [
						{ friend: 'Tony' },
						'rockstar',
						'pimp',
					],
				},
			} },
			opts : { mark : {
				prefix : '[[',
				suffix : ']]',
			} },
		} )
		expect( result ).toBe( 'hello Alice Copper. Your friend is Tony. You are a rockstar and a pimp.' )

	} )

} )
