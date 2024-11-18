import { ESLint } from 'eslint'
import {
	describe,
	it,
	expect,
} from 'vitest'

describe( 'ESLint configuration', () => {

	const lintFiles = [ 'tests/lint/**/*.{js,ts,vue,svelte,html,md,json,yml,toml,cjs}' ]

	it( 'should not have any ESLint errors', async () => {

		const eslint = new ESLint( {
			overrideConfigFile : 'tests/eslint.config.js',
			cache              : false,
		} )

		const results = await eslint.lintFiles( lintFiles )

		const errorCount = results.reduce( ( count, result ) => count + result.errorCount, 0 )

		expect( errorCount ).toBe( 0 )

	} )

	it( 'should have ESLint errors', async () => {

		try {

			const eslint = new ESLint( {
				overrideConfigFile : 'tests/eslint.config.error.js',
				cache              : false,
			} )

			const results = await eslint.lintFiles( lintFiles )

			const errorCount = results.reduce( ( count, result ) => count + result.errorCount, 0 )

			expect( errorCount ).toBeGreaterThan( 0 )

		}
		catch ( error ) {

			expect( error.message ).toContain( 'Could not find "invented-rule"' )

		}

	} )

} )
