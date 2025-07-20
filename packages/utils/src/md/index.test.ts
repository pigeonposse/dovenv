import {
	describe,
	it,
} from 'vitest'

describe( 'Markdown utilities', () => {

	it( 'should execute "index" without errors', async () => {

		await import( './index.example' )

	} )

	it( 'should execute "parser" without errors', async () => {

		await import( './parser.example' )

	} )

} )
